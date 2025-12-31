import XCTest
import SwiftTreeSitter
import TreeSitterDctTxt

final class TreeSitterDctTxtTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_dct_txt())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading DctTxt grammar")
    }
}
