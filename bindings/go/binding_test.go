package tree_sitter_dct_txt_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_dct_txt "github.com/okxhfiweohi/dct_txt_ts.git/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_dct_txt.Language())
	if language == nil {
		t.Errorf("Error loading DctTxt grammar")
	}
}
