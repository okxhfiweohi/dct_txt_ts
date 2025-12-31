; 注释
(comment) @comment

; 标识符
(identifier) @variable

; 流程节点符号
["{" "}" "[" "]" "," ":"] @punctuation.bracket

; 标量类型
(null_scalar) @constant.builtin
(boolean_scalar) @constant.builtin
(integer_scalar) @number
(float_scalar) @number.float
(quoted_scalar) @string
(plain_scalar) @string

; 转义序列
(escape_sequence) @string.escape

; 脚本行
(script_line) @comment
(script_line
  (identifier) @function.builtin
  )


; 键
(key_line_t) @text.strike
(text_line) @text.strong
(value_head) @text.strong
(list_head) @text.strong
(kvs_head) @text.strong

; 特殊行类型标记
(s_rr) @operator
(s_2r) @operator
(s_def) @operator
(s_lr) @operator
(s_list_sep) @operator

; 键值对映射
(flow_mapping_entries
  ":" @punctuation.delimiter
  (scalar) @variable.member
  )

