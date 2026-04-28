package middleware

import (
	"net/http"
	"strings"
)

// CORS returns middleware that sets Cross-Origin Resource Sharing headers.
// In development, allowedOrigins should include "http://localhost:3000".
// An empty allowedOrigins list defaults to allowing all origins ("*").
func CORS(allowedOrigins ...string) func(http.Handler) http.Handler {
	originSet := make(map[string]bool, len(allowedOrigins))
	for _, o := range allowedOrigins {
		originSet[strings.TrimRight(o, "/")] = true
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")

			// Determine allowed origin
			var allowOrigin string
			if len(originSet) == 0 {
				allowOrigin = "*"
			} else if originSet[origin] {
				allowOrigin = origin
			} else {
				// Origin not allowed — still process the request
				// but don't set CORS headers
				next.ServeHTTP(w, r)
				return
			}

			w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Max-Age", "86400")

			// Handle preflight
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
