// Package game implements the Meta Clash game engine, card generation,
// and bot AI logic.
package game

import (
	"context"
	"encoding/json"
	"fmt"
	"hash/fnv"
	"math/rand"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/nikhilsaxena04/meta_clash/backend/internal/game/packs"
	"github.com/nikhilsaxena04/meta_clash/backend/internal/models"
)

// Generator implements models.CardGenerator with a 3-tier fallback chain:
//  1. Jikan API — fetch characters for the given anime theme
//  2. Curated packs — if theme matches "one piece" or "pokemon"
//  3. Deterministic hash — generate cards with FNV-based stable stats
type Generator struct {
	jikanBase string
	client    *http.Client
}

// NewGenerator creates a CardGenerator with the given Jikan API base URL and timeout.
func NewGenerator(jikanBaseURL string, timeout time.Duration) *Generator {
	return &Generator{
		jikanBase: strings.TrimRight(jikanBaseURL, "/"),
		client:    &http.Client{Timeout: timeout},
	}
}

// Generate produces a full deck of TotalCards cards for the given theme.
// Fallback chain: Curated pack → Jikan API → deterministic hash generation.
func (g *Generator) Generate(theme string) (models.Deck, models.CardSource, error) {
	// Tier 1: Check curated packs
	if pack, ok := g.matchPack(theme); ok {
		return pack, models.CardSourcePack, nil
	}

	// Tier 2: Try Jikan API
	deck, err := g.fetchFromJikan(theme)
	if err == nil && len(deck) >= models.TotalCards {
		return deck[:models.TotalCards], models.CardSourceJikan, nil
	}

	// Tier 3: Deterministic hash-based generation
	deck = g.generateDeterministic(theme)
	return deck, models.CardSourceGenerate, nil
}

// --- Tier 1: Jikan API ---

// jikanSearchResponse is the JSON shape returned by Jikan's anime search endpoint.
type jikanSearchResponse struct {
	Data []struct {
		MalID int `json:"mal_id"`
	} `json:"data"`
}

// jikanCharactersResponse is the JSON shape returned by Jikan's anime characters endpoint.
type jikanCharactersResponse struct {
	Data []struct {
		Character struct {
			Name   string `json:"name"`
			Images struct {
				JPG struct {
					ImageURL string `json:"image_url"`
				} `json:"jpg"`
			} `json:"images"`
		} `json:"character"`
	} `json:"data"`
}

func (g *Generator) fetchFromJikan(theme string) (models.Deck, error) {
	ctx, cancel := context.WithTimeout(context.Background(), g.client.Timeout)
	defer cancel()

	// Step 1: Search for anime
	searchURL := fmt.Sprintf("%s/anime?q=%s&limit=1", g.jikanBase, url.QueryEscape(theme))
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, searchURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create search request: %w", err)
	}

	resp, err := g.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search Jikan: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Jikan search returned %d", resp.StatusCode)
	}

	var search jikanSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&search); err != nil {
		return nil, fmt.Errorf("failed to decode search response: %w", err)
	}
	if len(search.Data) == 0 {
		return nil, fmt.Errorf("no anime found for theme %q", theme)
	}

	// Step 2: Fetch characters
	malID := search.Data[0].MalID
	charsURL := fmt.Sprintf("%s/anime/%d/characters", g.jikanBase, malID)
	req2, err := http.NewRequestWithContext(ctx, http.MethodGet, charsURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create characters request: %w", err)
	}

	resp2, err := g.client.Do(req2)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch characters: %w", err)
	}
	defer resp2.Body.Close()

	if resp2.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Jikan characters returned %d", resp2.StatusCode)
	}

	var chars jikanCharactersResponse
	if err := json.NewDecoder(resp2.Body).Decode(&chars); err != nil {
		return nil, fmt.Errorf("failed to decode characters: %w", err)
	}
	if len(chars.Data) == 0 {
		return nil, fmt.Errorf("no characters found for anime %d", malID)
	}

	// Build cards — deduplicate by name
	seen := make(map[string]bool)
	var deck models.Deck
	for _, c := range chars.Data {
		name := c.Character.Name
		if seen[name] {
			continue
		}
		seen[name] = true

		image := c.Character.Images.JPG.ImageURL
		if image == "" {
			image = fmt.Sprintf("https://picsum.photos/seed/%s/320/420", url.QueryEscape(name))
		}

		deck = append(deck, models.Card{
			ID:    generateCardID(name),
			Name:  name,
			Image: image,
			Stats: generateDeterministicStats(name),
		})

		if len(deck) >= models.TotalCards {
			break
		}
	}

	return deck, nil
}

// --- Tier 2: Curated packs ---

func (g *Generator) matchPack(theme string) (models.Deck, bool) {
	if packs.IsOnePieceTheme(theme) {
		return packs.OnePiece(), true
	}
	if packs.IsPokemonTheme(theme) {
		return packs.Pokemon(), true
	}
	return nil, false
}

// --- Tier 3: Deterministic hash-based generation ---

func (g *Generator) generateDeterministic(theme string) models.Deck {
	deck := make(models.Deck, 0, models.TotalCards)
	for i := range models.TotalCards {
		name := fmt.Sprintf("%s #%d", theme, i+1)
		deck = append(deck, models.Card{
			ID:    generateCardID(name),
			Name:  name,
			Image: fmt.Sprintf("https://picsum.photos/seed/%s/320/420", url.QueryEscape(fmt.Sprintf("%s|%d", theme, i))),
			Stats: generateDeterministicStats(name),
		})
	}
	return deck
}

// generateDeterministicStats produces stable stats from a character name using FNV-1a hashing.
// The same name always produces the same stats across all games and servers.
func generateDeterministicStats(name string) models.Stats {
	return models.Stats{
		Rank:     hashStat(name, "rank"),
		Strength: hashStat(name, "strength"),
		Speed:    hashStat(name, "speed"),
		IQ:       hashStat(name, "iq"),
	}
}

// hashStat produces a deterministic integer in [10, 99] from name + attribute.
func hashStat(name, attr string) int {
	h := fnv.New32a()
	h.Write([]byte(name + "|" + attr))
	return int(h.Sum32()%90) + 10
}

// generateCardID produces a short hex ID from a character name.
func generateCardID(name string) string {
	h := fnv.New32a()
	h.Write([]byte(name))
	return fmt.Sprintf("%08x", h.Sum32())
}

// Compile-time interface check.
var _ models.CardGenerator = (*Generator)(nil)

// ShuffleDeck returns a new deck with cards in random order (Fisher-Yates).
func ShuffleDeck(deck models.Deck) models.Deck {
	shuffled := make(models.Deck, len(deck))
	copy(shuffled, deck)
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	for i := len(shuffled) - 1; i > 0; i-- {
		j := r.Intn(i + 1)
		shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
	}
	return shuffled
}
