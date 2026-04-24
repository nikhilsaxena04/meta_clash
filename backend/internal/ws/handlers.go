package ws

import (
	"encoding/json"
	"log/slog"

	"github.com/nikhilsaxena04/meta_clash/backend/internal/models"
)

// Handlers binds the websocket actions to the lobby manager
type Handlers struct {
	Manager models.LobbyManager
	Hub     *Hub
}

func NewHandlers(m models.LobbyManager, h *Hub) *Handlers {
	return &Handlers{Manager: m, Hub: h}
}

// BroadcastToLobby sends an event message to all connected clients regarding this lobby.
// In a real app we'd map lobby IDs to *Client sockets. For MVP, we broadcast to all 
// and clients ignore lobbies they aren't part of, or we can just send it out.
// Wait, for 4 players it's fine to broadcast to all clients if they check the lobby ID.
func (h *Handlers) BroadcastToLobby(action string, payload interface{}) {
	res := SocketResponse{
		Action:  action,
		Ok:      true,
		Payload: payload,
	}
	b, _ := json.Marshal(res)
	
	h.Hub.mu.RLock()
	for client := range h.Hub.clients {
		select {
		case client.send <- b:
		default:
		}
	}
	h.Hub.mu.RUnlock()
}

func (h *Handlers) Dispatch(c *Client, msg SocketMessage) {
	switch msg.Action {
	case "createLobby":
		h.handleCreateLobby(c, msg)
	case "joinLobby":
		h.handleJoinLobby(c, msg)
	case "addBot":
		h.handleAddBot(c, msg)
	case "startGame":
		h.handleStartGame(c, msg)
	case "chooseAttribute":
		h.handleChooseAttribute(c, msg)
	default:
		slog.Warn("Unknown ws action", "action", msg.Action)
	}
}

func (h *Handlers) handleCreateLobby(c *Client, msg SocketMessage) {
	var req struct {
		Name  string `json:"name"`
		Theme string `json:"theme"`
	}
	if err := json.Unmarshal(msg.Payload, &req); err != nil {
		c.Reply(msg.ReqID, msg.Action, false, "Invalid payload", nil)
		return
	}

	host := models.Player{
		ID:   models.PlayerID("p_" + msg.ReqID), // Simple fake ID for now
		Name: req.Name,
	}

	l, err := h.Manager.CreateLobby(req.Theme, host)
	if err != nil {
		c.Reply(msg.ReqID, msg.Action, false, err.Error(), nil)
		return
	}

	c.Reply(msg.ReqID, msg.Action, true, "", map[string]interface{}{"lobby": l})
}

func (h *Handlers) handleJoinLobby(c *Client, msg SocketMessage) {
	var req struct {
		LobbyID string `json:"lobbyId"`
		Name    string `json:"name"`
	}
	if err := json.Unmarshal(msg.Payload, &req); err != nil {
		c.Reply(msg.ReqID, msg.Action, false, "Invalid payload", nil)
		return
	}

	p := models.Player{
		ID:   models.PlayerID("p_" + msg.ReqID),
		Name: req.Name,
	}

	l, err := h.Manager.JoinLobby(req.LobbyID, p)
	if err != nil {
		c.Reply(msg.ReqID, msg.Action, false, err.Error(), nil)
		return
	}

	c.Reply(msg.ReqID, msg.Action, true, "", map[string]interface{}{"lobby": l})
	h.BroadcastToLobby("lobbyUpdate", l)
}

func (h *Handlers) handleAddBot(c *Client, msg SocketMessage) {
	var req struct {
		LobbyID string `json:"lobbyId"`
	}
	if err := json.Unmarshal(msg.Payload, &req); err != nil {
		c.Reply(msg.ReqID, msg.Action, false, "Invalid payload", nil)
		return
	}

	l, err := h.Manager.AddBot(req.LobbyID)
	if err != nil {
		c.Reply(msg.ReqID, msg.Action, false, err.Error(), nil)
		return
	}

	c.Reply(msg.ReqID, msg.Action, true, "", map[string]interface{}{"lobby": l})
	h.BroadcastToLobby("lobbyUpdate", l)
}

func (h *Handlers) handleStartGame(c *Client, msg SocketMessage) {
	var req struct {
		LobbyID string `json:"lobbyId"`
	}
	if err := json.Unmarshal(msg.Payload, &req); err != nil {
		c.Reply(msg.ReqID, msg.Action, false, "Invalid payload", nil)
		return
	}

	l, err := h.Manager.StartGame(req.LobbyID)
	if err != nil {
		c.Reply(msg.ReqID, msg.Action, false, err.Error(), nil)
		return
	}

	c.Reply(msg.ReqID, msg.Action, true, "", nil)
	h.BroadcastToLobby("gameStarted", l)
}

func (h *Handlers) handleChooseAttribute(c *Client, msg SocketMessage) {
	var req struct {
		LobbyID  string `json:"lobbyId"`
		PlayerID string `json:"playerId"`
		Attr     string `json:"attr"`
	}
	if err := json.Unmarshal(msg.Payload, &req); err != nil {
		c.Reply(msg.ReqID, msg.Action, false, "Invalid payload", nil)
		return
	}

	_, res, err := h.Manager.PlayRound(req.LobbyID, models.PlayerID(req.PlayerID), req.Attr)
	if err != nil {
		c.Reply(msg.ReqID, msg.Action, false, err.Error(), nil)
		return
	}

	c.Reply(msg.ReqID, msg.Action, true, "", nil)
	
	// Broadcast round results
	h.BroadcastToLobby("roundResult", map[string]interface{}{
		"attr":     res.Attr,
		"winnerId": res.WinnerID,
		"reveals":  res.Reveals,
		"lobby":    res.LobbyObj, // Include full updated state too
	})
	
	// Wait, standardizing roundResult payload so it mimics the old socket.js
	// the old socket.js expects: { attr, winnerId, reveals, lobby }
}
