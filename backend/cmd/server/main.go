// Package main is the entry point for the Meta Clash Go backend.
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nikhilsaxena04/meta_clash/backend/internal/config"
	"github.com/nikhilsaxena04/meta_clash/backend/internal/game"
	"github.com/nikhilsaxena04/meta_clash/backend/internal/lobby"
	"github.com/nikhilsaxena04/meta_clash/backend/internal/models"
	"github.com/nikhilsaxena04/meta_clash/backend/internal/ws"
)

func main() {
	// Structured logging
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	// Load configuration
	cfg := config.Load()

	// Wire dependencies
	cardGen := game.NewGenerator(cfg.JikanBaseURL, cfg.JikanTimeout)
	engine := game.NewEngine()
	store := lobby.NewMemoryStore()
	manager := lobby.NewManager(store, cardGen, engine)

	// Initialize WebSocket Hub
	hub := ws.NewHub()
	go hub.Run()
	wsHandlers := ws.NewHandlers(manager, hub)

	// HTTP mux
	mux := http.NewServeMux()

	// WebSocket endpoint
	mux.HandleFunc("GET /api/ws", func(w http.ResponseWriter, r *http.Request) {
		ws.ServeWs(hub, wsHandlers, w, r)
	})

	// Health check
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"ok","time":"%s"}`, time.Now().UTC().Format(time.RFC3339))
	})

	// Readiness check
	mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"ready"}`)
	})

	// Debug endpoint to demonstrate the game engine
	mux.HandleFunc("GET /api/debug/lobby", func(w http.ResponseWriter, r *http.Request) {
		manager := lobby.NewManager(store, cardGen, engine)
		theme := r.URL.Query().Get("theme")
		if theme == "" {
			theme = "one piece"
		}

		host := models.Player{
			ID:   models.PlayerID("host-123"),
			Name: "HumanPlayer",
		}

		l, err := manager.CreateLobby(theme, host)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Fill with bots and start
		l, err = manager.StartGame(l.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(l)
	})

	// Server
	addr := fmt.Sprintf(":%d", cfg.Port)
	srv := &http.Server{
		Addr:         addr,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		slog.Info("server starting", "addr", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()

	// Wait for interrupt
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	slog.Info("shutting down", "signal", sig.String())

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		slog.Error("shutdown error", "error", err)
		os.Exit(1)
	}

	slog.Info("server stopped")
}
