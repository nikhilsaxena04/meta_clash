package game

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/nikhilsaxena04/meta_clash/backend/internal/models"
)

// JikanClient handles outbound requests to the Jikan API with an in-memory cache
// to prevent rate-limiting on popular themes.
type JikanClient struct {
	baseURL string
	client  *http.Client
	
	// Simple thread-safe cache: Theme Name -> Deck
	cacheMu sync.RWMutex
	cache   map[string]cacheEntry
}

type cacheEntry struct {
	deck      models.Deck
	timestamp time.Time
}

// NewJikanClient creates a new Jikan API client.
func NewJikanClient(baseURL string, timeout time.Duration) *JikanClient {
	return &JikanClient{
		baseURL: baseURL,
		client:  &http.Client{Timeout: timeout},
		cache:   make(map[string]cacheEntry),
	}
}

// FetchDeck searches for an anime by theme and returns a deck of its characters.
// It checks the cache first.
func (c *JikanClient) FetchDeck(theme string) (models.Deck, error) {
	themeKey := strings.ToLower(strings.TrimSpace(theme))

	// 1. Check cache (Valid for 1 hour)
	c.cacheMu.RLock()
	if entry, ok := c.cache[themeKey]; ok {
		if time.Since(entry.timestamp) < time.Hour {
			c.cacheMu.RUnlock()
			return copyDeck(entry.deck), nil
		}
	}
	c.cacheMu.RUnlock()

	// 2. Fetch from Jikan
	deck, err := c.fetchFromAPI(theme)
	if err != nil {
		return nil, err
	}

	// 3. Save to cache
	c.cacheMu.Lock()
	// Basic cache eviction if it grows too large (prevent memory leaks)
	if len(c.cache) > 100 {
		c.cache = make(map[string]cacheEntry) // clear all for simplicity
	}
	c.cache[themeKey] = cacheEntry{
		deck:      deck,
		timestamp: time.Now(),
	}
	c.cacheMu.Unlock()

	return copyDeck(deck), nil
}

func (c *JikanClient) fetchFromAPI(theme string) (models.Deck, error) {
	ctx, cancel := context.WithTimeout(context.Background(), c.client.Timeout)
	defer cancel()

	// Step 1: Search Anime
	searchURL := fmt.Sprintf("%s/anime?q=%s&limit=1", c.baseURL, url.QueryEscape(theme))
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, searchURL, nil)
	if err != nil {
		return nil, fmt.Errorf("search request error: %w", err)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("jikan api connection failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusTooManyRequests {
		return nil, fmt.Errorf("rate limited (429)")
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("search returned status %d", resp.StatusCode)
	}

	var searchResp jikanSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&searchResp); err != nil {
		return nil, fmt.Errorf("failed to decode search JSON: %w", err)
	}
	if len(searchResp.Data) == 0 {
		return nil, fmt.Errorf("no anime found for %q", theme)
	}

	// Step 2: Fetch Characters
	malID := searchResp.Data[0].MalID
	charsURL := fmt.Sprintf("%s/anime/%d/characters", c.baseURL, malID)
	
	req2, err := http.NewRequestWithContext(ctx, http.MethodGet, charsURL, nil)
	if err != nil {
		return nil, fmt.Errorf("chars request error: %w", err)
	}

	// Be nice to the API
	time.Sleep(500 * time.Millisecond)

	resp2, err := c.client.Do(req2)
	if err != nil {
		return nil, fmt.Errorf("jikan api chars connection failed: %w", err)
	}
	defer resp2.Body.Close()

	if resp2.StatusCode == http.StatusTooManyRequests {
		return nil, fmt.Errorf("rate limited (429) on characters")
	}
	if resp2.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("characters returned status %d", resp2.StatusCode)
	}

	var charsResp jikanCharactersResponse
	if err := json.NewDecoder(resp2.Body).Decode(&charsResp); err != nil {
		return nil, fmt.Errorf("failed to decode chars JSON: %w", err)
	}
	
	// Build the deck
	seen := make(map[string]bool)
	var deck models.Deck

	for _, c := range charsResp.Data {
		name := c.Character.Name
		if seen[name] {
			continue
		}
		seen[name] = true

		image := c.Character.Images.JPG.ImageURL
		if image == "" {
			image = fmt.Sprintf("https://picsum.photos/seed/%s/320/420", url.QueryEscape(name))
		}

		// Factor in favorites if available, combined with hash for stability
		baseRank := c.Favorites % 50 
		stats := generateDeterministicStats(name)
		// Boost rank based on character popularity
		stats.Rank = min(99, stats.Rank + baseRank)

		deck = append(deck, models.Card{
			ID:    generateCardID(name),
			Name:  name,
			Image: image,
			Stats: stats,
		})

		if len(deck) >= models.TotalCards {
			break
		}
	}

	if len(deck) < models.TotalCards {
		return nil, fmt.Errorf("not enough characters found (%d/%d)", len(deck), models.TotalCards)
	}

	return deck, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func copyDeck(d models.Deck) models.Deck {
	cp := make(models.Deck, len(d))
	copy(cp, d)
	return cp
}

// JSON Structs
type jikanSearchResponse struct {
	Data []struct {
		MalID int `json:"mal_id"`
	} `json:"data"`
}

type jikanCharactersResponse struct {
	Data []struct {
		Favorites int `json:"favorites"`
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
