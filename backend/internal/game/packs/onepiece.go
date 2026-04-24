// Package packs provides curated, lore-accurate card data for fallback when
// the Jikan API is unavailable or unreliable.
package packs

import "github.com/nikhilsaxena04/meta_clash/backend/internal/models"

// OnePiece returns 24 hand-curated One Piece characters with lore-accurate stats.
// Stats range 1-99: Rank (overall power level), Strength, Speed, IQ.
func OnePiece() models.Deck {
	return models.Deck{
		{ID: "op01", Name: "Monkey D. Luffy", Image: "https://cdn.myanimelist.net/images/characters/9/310307.jpg", Stats: models.Stats{Rank: 95, Strength: 92, Speed: 88, IQ: 45}},
		{ID: "op02", Name: "Roronoa Zoro", Image: "https://cdn.myanimelist.net/images/characters/3/100534.jpg", Stats: models.Stats{Rank: 90, Strength: 95, Speed: 80, IQ: 50}},
		{ID: "op03", Name: "Sanji", Image: "https://cdn.myanimelist.net/images/characters/5/82879.jpg", Stats: models.Stats{Rank: 85, Strength: 82, Speed: 92, IQ: 70}},
		{ID: "op04", Name: "Nami", Image: "https://cdn.myanimelist.net/images/characters/2/282673.jpg", Stats: models.Stats{Rank: 60, Strength: 30, Speed: 65, IQ: 90}},
		{ID: "op05", Name: "Nico Robin", Image: "https://cdn.myanimelist.net/images/characters/12/148825.jpg", Stats: models.Stats{Rank: 75, Strength: 70, Speed: 60, IQ: 95}},
		{ID: "op06", Name: "Tony Tony Chopper", Image: "https://cdn.myanimelist.net/images/characters/11/309979.jpg", Stats: models.Stats{Rank: 55, Strength: 60, Speed: 50, IQ: 85}},
		{ID: "op07", Name: "Franky", Image: "https://cdn.myanimelist.net/images/characters/13/311053.jpg", Stats: models.Stats{Rank: 70, Strength: 85, Speed: 45, IQ: 80}},
		{ID: "op08", Name: "Brook", Image: "https://cdn.myanimelist.net/images/characters/8/310304.jpg", Stats: models.Stats{Rank: 65, Strength: 55, Speed: 85, IQ: 60}},
		{ID: "op09", Name: "Usopp", Image: "https://cdn.myanimelist.net/images/characters/3/72452.jpg", Stats: models.Stats{Rank: 50, Strength: 35, Speed: 55, IQ: 75}},
		{ID: "op10", Name: "Jinbe", Image: "https://cdn.myanimelist.net/images/characters/10/377543.jpg", Stats: models.Stats{Rank: 80, Strength: 88, Speed: 55, IQ: 72}},
		{ID: "op11", Name: "Shanks", Image: "https://cdn.myanimelist.net/images/characters/9/225671.jpg", Stats: models.Stats{Rank: 98, Strength: 90, Speed: 90, IQ: 85}},
		{ID: "op12", Name: "Kaido", Image: "https://cdn.myanimelist.net/images/characters/14/351081.jpg", Stats: models.Stats{Rank: 97, Strength: 99, Speed: 70, IQ: 55}},
		{ID: "op13", Name: "Big Mom", Image: "https://cdn.myanimelist.net/images/characters/15/351082.jpg", Stats: models.Stats{Rank: 96, Strength: 95, Speed: 60, IQ: 65}},
		{ID: "op14", Name: "Blackbeard", Image: "https://cdn.myanimelist.net/images/characters/12/246405.jpg", Stats: models.Stats{Rank: 94, Strength: 88, Speed: 50, IQ: 80}},
		{ID: "op15", Name: "Trafalgar Law", Image: "https://cdn.myanimelist.net/images/characters/2/207557.jpg", Stats: models.Stats{Rank: 82, Strength: 70, Speed: 75, IQ: 92}},
		{ID: "op16", Name: "Boa Hancock", Image: "https://cdn.myanimelist.net/images/characters/7/210255.jpg", Stats: models.Stats{Rank: 83, Strength: 78, Speed: 80, IQ: 68}},
		{ID: "op17", Name: "Doflamingo", Image: "https://cdn.myanimelist.net/images/characters/11/259497.jpg", Stats: models.Stats{Rank: 88, Strength: 82, Speed: 78, IQ: 90}},
		{ID: "op18", Name: "Crocodile", Image: "https://cdn.myanimelist.net/images/characters/7/284129.jpg", Stats: models.Stats{Rank: 78, Strength: 75, Speed: 62, IQ: 88}},
		{ID: "op19", Name: "Portgas D. Ace", Image: "https://cdn.myanimelist.net/images/characters/8/240891.jpg", Stats: models.Stats{Rank: 86, Strength: 85, Speed: 82, IQ: 55}},
		{ID: "op20", Name: "Sabo", Image: "https://cdn.myanimelist.net/images/characters/16/351083.jpg", Stats: models.Stats{Rank: 87, Strength: 86, Speed: 84, IQ: 72}},
		{ID: "op21", Name: "Mihawk", Image: "https://cdn.myanimelist.net/images/characters/14/255469.jpg", Stats: models.Stats{Rank: 92, Strength: 90, Speed: 88, IQ: 78}},
		{ID: "op22", Name: "Aokiji", Image: "https://cdn.myanimelist.net/images/characters/15/351084.jpg", Stats: models.Stats{Rank: 91, Strength: 80, Speed: 75, IQ: 88}},
		{ID: "op23", Name: "Kizaru", Image: "https://cdn.myanimelist.net/images/characters/16/351085.jpg", Stats: models.Stats{Rank: 89, Strength: 78, Speed: 99, IQ: 60}},
		{ID: "op24", Name: "Akainu", Image: "https://cdn.myanimelist.net/images/characters/5/246403.jpg", Stats: models.Stats{Rank: 93, Strength: 92, Speed: 72, IQ: 75}},
	}
}

// IsOnePieceTheme reports whether the given theme string matches "One Piece".
func IsOnePieceTheme(theme string) bool {
	switch theme {
	case "one piece", "onepiece", "One Piece", "OnePiece", "ONE PIECE":
		return true
	}
	return false
}
