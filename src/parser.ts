/**
 * Recursive-descent parser for arithmetic expressions.
 *
 * Grammar (precedence low â high):
 *   expression  = term (('+' | '-') term)*
 *   term        = exponent (('*' | '/' | '%') exponent)*
 *   exponent    = unary ('^' unary)*       (right-associative)
 *   unary       = ('+' | '-') unary | primary
 *   primary     = NUMBER | '(' expression ')'
 */

import { Token, ASTNode } from "./types";
import { TsParserError } from "./errors";
import { tokenize } from "./tokenizer";

/**
 * Parse an arithmetic expression string into an AST.
 *
 * @throws TsParserError if the input is not a string, is empty/whitespace-only,
 *         contains syntax errors, or has unbalanced parentheses.
 */
export function parse(input: string): ASTNode {
  if (typeof input !== "string") {
    throw new TsParserError("input must be a string");
  }
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new TsParserError("input must not be empty");
  }

  const tokens = tokenize(input);
  const state = { tokens, position: 0 };
  const ast = parseExpression(state);

  if (current(state).kind !== "eof") {
    throw new TsParserError(
      `Unexpected token '${current(state).value}' after complete expression`,
    );
  }

  return ast;
}

// ââ State helpers ââââââââââââââââââââââââââââââââââââââââââââââââââ

interface ParserState {
  tokens: Token[];
  position: number;
}

function current(state: ParserState): Token {
  return state.tokens[state.position];
}

function advance(state: ParserState): Token {
  const token = state.tokens[state.position];
  state.position++;
  return token;
}

// ââ Grammar rules âââââââââââââââââââââââââââââââââââââââââââââââââ

function parseExpression(state: ParserState): ASTNode {
  let left = parseTerm(state);

  while (current(state).kind === "plus" || current(state).kind === "minus") {
    const operator = advance(state).value as "+" | "-";
    const right = parseTerm(state);
    left = { type: "BinaryExpression", operator, left, right };
  }

  return left;
}

function parseTerm(state: ParserState): ASTNode {
  let left = parseExponent(state);

  while (
    current(state).kind === "star" ||
    current(state).kind === "slash" ||
    current(state).kind === "percent"
  ) {
    const operator = advance(state).value as "*" | "/" | "%";
    const right = parseExponent(state);
    left = { type: "BinaryExpression", operator, left, right };
  }

  return left;
}

function parseExponent(state: ParserState): ASTNode {
  const base = parseUnary(state);

  if (current(state).kind === "caret") {
    advance(state);
    const exponent = parseExponent(state);
    return { type: "BinaryExpression", operator: "^", left: base, right: exponent };
  }

  return base;
}

function parseUnary(state: ParserState): ASTNode {
  if (current(state).kind === "plus" || current(state).kind === "minus") {
    const operator = advance(state).value as "+" | "-";
    const operand = parseUnary(state);
    return { type: "UnaryExpression", operator, operand };
  }

  return parsePrimary(state);
}

function parsePrimary(state: ParserState): ASTNode {
  const token = current(state);

  if (token.kind === "number") {
    advance(state);
    return { type: "NumberLiteral", value: parseFloat(token.value) };
  }

  if (token.kind === "lparen") {
    advance(state);
    const expression = parseExpression(state);
    if (current(state).kind !== "rparen") {
      throw new TsParserError("Expected closing parenthesis ')'");
    }
    advance(state);
    return expression;
  }

  if (token.kind === "eof") {
    throw new TsParserError("Unexpected end of input");
  }

  throw new TsParserError(`Unexpected token '${token.value}'`);
}
