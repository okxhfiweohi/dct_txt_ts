; 注释
(comment) @comment

; 标识符
(identifier) @variable

; 标量类型
; 流节点自身的标量（不在映射或序列中）
(null_scalar) @constant.builtin
(boolean_scalar) @constant.builtin
(integer_scalar) @number
(float_scalar) @number.float
key: (flow_node
         (scalar
           (quoted_scalar) @property
           ))
key: (flow_node
         (scalar
           (plain_scalar) @property
           ))
key: (flow_node
       (flow_mapping) @text.underline
      )
key: (flow_node
       (flow_sequence) @text.underline
      )
value: (flow_node
         (scalar
           (quoted_scalar) @string
           ))
value: (flow_node
         (scalar
           (plain_scalar) @string
           ))
; 结构和标点符号
(flow_mapping
  "{" @punctuation.bracket
  "}" @punctuation.bracket)

(flow_sequence
  "[" @punctuation.bracket
  "]" @punctuation.bracket)
(flow_mapping_entry
  ":" @punctuation.delimiter
  )
(flow_mapping_entries
  "," @punctuation.delimiter
  )
(flow_sequence_entries
    "," @punctuation.delimiter
  )

;转义序列
(escape_sequence) @string.escape

; 脚本行
(script_line) @comment
(script_line
  (identifier) @function.builtin
  )


; 键
(head_chunk) @text.strike
(text_line
  (head_chunk) @text.strong
  ) 
(value_line
  ( head_chunk ) @text.strong
  )
(list_line
  ( head_chunk ) @text.strong
  )
(kvs_line
  ( head_chunk ) @text.strong
  )

; 特殊行类型标记
(s_rr) @operator
(s_2r) @operator
(s_def) @operator
(s_lr) @operator
(s_list_sep) @operator

