package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"index/suffixarray"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func main() {
	searcher := Searcher{}
	err := searcher.Load("completeworks.txt")
	if err != nil {
		log.Fatal(err)
	}

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	http.HandleFunc("/search", handleSearch(searcher))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	fmt.Printf("shakesearch available at http://localhost:%s...", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	if err != nil {
		log.Fatal(err)
	}
}

type Searcher struct {
	CompleteWorks        string
	SuffixArray          *suffixarray.Index
	SuffixArrayLowercase *suffixarray.Index
}

func handleSearch(searcher Searcher) func(w http.ResponseWriter, r *http.Request) {
	defaultSearchParams := map[string]interface{}{
		"isCaseSensitive": false,
		"first":           20,
	}

	return func(w http.ResponseWriter, r *http.Request) {
		query, ok := r.URL.Query()["q"]
		if !ok || len(query[0]) < 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing search query in URL params"))
			return
		}

		first, ok := r.URL.Query()["first"]
		var resultsLength int = defaultSearchParams["first"].(int)
		if ok {
			resultsLength, _ = strconv.Atoi(first[0])
		}

		results := searcher.Search(query[0], defaultSearchParams["isCaseSensitive"].(bool), resultsLength)
		buf := &bytes.Buffer{}
		enc := json.NewEncoder(buf)
		err := enc.Encode(results)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("encoding failure"))
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(buf.Bytes())
	}
}

func (s *Searcher) Load(filename string) error {
	dat, err := ioutil.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("Load: %w", err)
	}
	s.CompleteWorks = string(dat)
	s.SuffixArray = suffixarray.New(dat)
	s.SuffixArrayLowercase = suffixarray.New(bytes.ToLower(dat))
	return nil
}

func (s *Searcher) Search(query string, isCaseSensitive bool, first int) []string {
	var suffixArray *suffixarray.Index
	var searchQuery string

	if isCaseSensitive {
		searchQuery = query
		suffixArray = s.SuffixArray
	} else {
		searchQuery = strings.ToLower(query)
		suffixArray = s.SuffixArrayLowercase
	}

	idxs := suffixArray.Lookup([]byte(searchQuery), first)
	results := []string{}
	for _, idx := range idxs {
		results = append(results, s.CompleteWorks[idx-250:idx+250])
	}
	return results
}
