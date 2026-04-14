/**
 * Token and AST node type definitions for tsparser.
 */

export type TokenKind =
  | "number"
  | "plus"
  | "minus"
  | "star"
  | "slash"
  | "percent"
  | "caret"
  | "lparen"
  | "rparen"
  | "eof";

export interface Token {
  readonly kind: TokenKind;
  readonly value: string;
}

export type ASTNode =
  | NumberLiteral
  | UnaryExpression
  | BinaryExpression;

export interface NumberLiteral {
  readonly type: "NumberLiteral";
  readonly value: number;
}

export interface UnaryExpression {
  readonly type: "UnaryExpression";
  readonly operator: "+" | "-";
  readonly operand: ASTNode;
}

export interface BinaryExpression {
  readonly type: "BinaryExpression";
  readonly operator: "+" | "-" | "*" | "/" | "%" | "^";
  readonly left: ASTNode;
  readonly right: ASTNode;
}
