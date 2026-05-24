package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "postgres://postgres:postgres@localhost:5432/meta_clash?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}

	var won bool
	err = db.QueryRow(`SELECT NULL = '8a0cc97d-821a-4e8d-95fa-68170c7b9e69'::uuid`).Scan(&won)
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("Won:", won)
	}
}
