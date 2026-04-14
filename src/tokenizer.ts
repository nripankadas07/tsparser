/**
 * Tokenizer: converts an expression string into an array of tokens.
 */

import { Token, TokenKind } from "./types";
import { TsParserError } from "./errors";

const SINGLE_CHAR_TOKENS: Record<string, TokenKind> = {
  "+": "plus",
  "-": "minus",
  "*": "star",
  "/": "slash",
  "%": "percent",
  "^": "caret",
  "(": "lparen",
  ")": "rparen",
};

/**
 * Tokenize an arithmetic expression string into an array of tokens.
 *
 * Supported tokens: numbers (integers and decimals), operators (+, -, *, /, %, ^),
 * and parentheses. Whitespace is skipped. An EOF token is appended at the end.
 *
 * @throws TsParserError if the input is not a string or contains unknown characters.
 */
export function tokenize(input: string): Token[] {
  if (typeof input !== "string") {
    throw new TsParserError("input must be a string");
  }

  const tokens: Token[] = [];
  let position = 0;

  while (position < input.length) {
    const char = input[position];

    if (isWhitespace(char)) {
      position++;
      continue;
    }

    if (char in SINGLE_CHAR_TOKENS) {
      tokens.push({ kind: SINGLE_CHAR_TOKENS[char], value: char });
      position++;
      continue;
    }

    if (isDigitOrDot(char)) {
      const numberToken = readNumber(input, position);
      tokens.push(numberToken.token);
      position = numberToken.nextPosition;
      continue;
    }

    throw new TsParserError(`Unexpected character '${char}' at position ${position}`);
  }

  tokens.push({ kind: "eof", value: "" });
  return tokens;
}

function isWhitespace(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

function isDigitOrDot(char: string): boolean {
  return (char >= "0" && char <= "9") || char === ".";
}

function readNumber(
  input: string,
  start: number,
): { token: Token; nextPosition: number } {
  let position = start;
  let hasDot = false;

  while (position < input.length && isDigitOrDot(input[position])) {
    if (input[position] === ".") {
      if (hasDot) {
        throw new TsParserError(
          `Invalid number: multiple decimal points at position ${position}`,
        );
      }
      hasDot = true;
    }
    position++;
  }

  const value = input.slice(start, position);
  if (value === ".") {
    throw new TsParserError(`Invalid number: lone decimal point at position ${start}`);
  }

  return { token: { kind: "number", value }, nextPosition: position };
}
