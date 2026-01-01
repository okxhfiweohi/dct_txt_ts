/**
 * @file DctTxt grammar for tree-sitter
 * @author
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const _ws = /[ \t]+/
export default grammar({
  name: "dct_txt",
  extras: ($) => [
    _ws,
    $.comment,
  ],

  conflicts: ($) => [],

  rules: {
    source_file: ($) =>
      repeat1(
        seq(
          optional(choice(
            $.value_line, // >>
            $.text_line, // =>
            $.list_line, // :=
            $.kvs_line, // <>
            $.script_line, // /*! ...*/
            $.head_chunk, // other
          )),
          $._s_n,
        ),
      ),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    _s_n: ($) => /\r?\n/,
    script_line: ($) =>
      seq(
        "/*!",
        field("cmd", $.identifier),
        optional($.flow_sequence),
        optional($.flow_mapping),
        "*/",
      ),

    // _ws: ($) => /[ \t]+/,

    head_chunk: ($) =>
      repeat1(choice(
        /[^:=<>/\n\r]+/,
        seq(":",
          optional(/[^:=<>/\n\r]/),
        ),
        seq("=",
          optional(/[^:=<>/\n\r]/),
        ),
        seq(">",
          optional(/[^:=<>/\n\r]/),
        ),
        seq("<",
          optional(/[^:=<>/\n\r]/),
        ),
        seq("/",
          optional(/[^:=<>/\n\r*]/),
        ),
      )),

    s_rr: ($) => ">>",
    value_line: ($) =>
      seq(
        $.head_chunk,
        $.s_rr,
        optional(field("value", $.flow_node)),
      ),

    s_2r: ($) => "=>",
    text_line: ($) =>
      seq(
        $.head_chunk,
        $.s_2r,
        repeat(choice(
          /[^/\n\r]+/,
          seq("/", /[^*\n\r]/)
        )),
      ),

    s_def: ($) => ":=",
    list_t: ($) => /[^/\n\r|]+/,
    s_list_sep: ($) => "||",
    list_items: ($) =>
      repeat1(
        choice(
          $.list_t,
          field("s", $.s_list_sep),
          choice("|", "\r"),
        ),
      ),
    list_line: ($) =>
      seq(
        $.head_chunk,
        $.s_def,
        optional($.list_items),
      ),

    s_lr: ($) => "<>",
    kvs_line: ($) =>
      seq(
        $.head_chunk,
        $.s_lr,
        optional($.flow_mapping_entries),
      ),

    _comment: ($) =>
      seq(
        optional(/[^*\n]+/),
        choice(
          "*/",
          seq(
            "*",
            $._comment,
          ),
        ),
      ),
    comment: ($) =>
      seq(
        "/*",
        $._comment,
      ),

    flow_node: ($) =>
      choice(
        $.flow_mapping,
        $.flow_sequence,
        $.scalar,
      ),

    flow_mapping: ($) =>
      seq(
        "{",
        optional($.flow_mapping_entries),
        "}",
      ),

    flow_mapping_entries: ($) => sepBy1(",", $.flow_mapping_entry),

    flow_mapping_entry: ($) =>
      seq(
        field("key", $.flow_node),
        optional(choice(
          ":",
          seq(
            ":",
            field("value", $.flow_node),
          ),
        )),
      ),

    flow_sequence: ($) =>
      seq(
        "[",
        optional($.flow_sequence_entries),
        "]",
      ),

    flow_sequence_entries: ($) => sepBy1(",", field("value", $.flow_node)),

    scalar: ($) =>
      choice(
        $.null_scalar,
        $.boolean_scalar,
        $.integer_scalar,
        $.float_scalar,
        $.quoted_scalar,
        $.plain_scalar,
      ),

    null_scalar: ($) =>
      choice(
        "null",
        "Null",
        "NULL",
        seq("!!null", _ws, choice("null", "''")),
      ),

    boolean_scalar: ($) =>
      choice(
        "true",
        "True",
        "TRUE",
        "false",
        "False",
        "FALSE",
      ),

    integer_scalar: ($) => /[-+]?(?:0|[1-9][0-9]*)/,

    float_scalar: ($) =>
      /[-+]?(?:[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)(?:[eE][-+]?[0-9]+)?/,

    quote_trans: ($) => /\\[^\n]/,
    quote_single: ($) =>
      seq(
        "'",
        repeat(choice(
          /[^\n']/,
          $.quote_trans,
        )),
        "'",
      ),
    quote_double: ($) =>
      seq(
        '"',
        repeat(choice(
          /[^\n"]/,
          $.quote_trans,
        )),
        '"',
      ),
    quoted_scalar: ($) =>
      choice(
        seq('"', $._double_quoted_string_content, '"'),
        seq("'", $._single_quoted_string_content, "'"),
      ),

    _double_quoted_string_content: ($) =>
      repeat1(choice(
        /[^\\"\n]+/,
        $.escape_sequence,
      )),

    _single_quoted_string_content: ($) => /[^'\n]+/,

    escape_sequence: ($) =>
      token(seq(
        "\\",
        choice(
          /[0abtnvfre "\\\/]/,
          /u[0-9a-fA-F]{4}/,
          /U[0-9a-fA-F]{8}/,
        ),
      )),

    plain_scalar: ($) =>
      seq(
        /[^\s\[\]{},:\n]/,
        repeat(choice(
          /[^\s\[\]{},:\n]+/,
          /:[^\s\[\]{},\n]/,
        )),
      ),
  },
});

function sepBy1(separator, rule) {
  return seq(rule, repeat(seq(separator, rule)), optional(separator));
}
