# tsparser

Tiny TypeScript tokenizer and recursive-descent parser for arithmetic expressions.

## Installation

```bash
npm install tsparser
```

Or install from source:

```bash
git clone https://github.com/nripankadas07/tsparser.git
cd tsparser
npm install
npm run build
```

## Usage

```typescript
import { tokenize, parse, evaluate } from "tsparser";

// Tokenize an expression into tokens
const tokens = tokenize("(1 + 2) * 3");
// [{ kind: "lparen", value: "(" }, { kind: "number", value: "1" }, ...]

// Parse an expression into an AST
const ast = parse("2 + 3 * 4");
// {
//   type: "BinaryExpression",
//   operator: "+",
//   left: { type: "NumberLiteral", value: 2 },
//   right: {
//     type: "BinaryExpression",
//     operator: "*",
//     left: { type: "NumberLiteral", value: 3 },
//     right: { type: "NumberLiteral", value: 4 }
//   }
// }

// Evaluate an expression to a number
evaluate("(2 + 3) * 4");   // 20
evaluate("2 ^ 3 ^ 2");     // 512 (right-associative)
evaluate("-5 + 10");        // 5
evaluate("10 % 3");         // 1
```

## API Reference

### `tokenize(input: string): Token[]`

Tokenize an arithmetic expression string into an array of tokens. An EOF token is appended at the end.

**Supported tokens:** numbers (integers and decimals), operators (`+`, `-`, `*`, `/`, `%`, `^`), and parentheses. Whitespace is skipped.

**Throws:** `TsParserError` if the input contains unknown characters, has multiple decimal points in a number, or is not a string.

### `parse(input: string): ASTNode`

Parse an arithmetic expression string into an abstract syntax tree (AST) using recursive descent.

**Grammar (precedence low to high):**
1. Addition and subtraction (`+`, `-`)
2. Multiplication, division, modulo (`*`, `/`, `%`)
3. Exponentiation (`^`, right-associative)
4. Unary operators (`+`, `-`)
5. Parenthesized expressions and number literals

**Throws:** `TsParserError` for syntax errors, unbalanced parentheses, empty input, or non-string input.

### `evaluate(input: string): number`

Parse and evaluate an arithmetic expression string to a number.

**Throws:** `TsParserError` for syntax errors, division by zero, or modulo by zero.

### `TsParserError`

Custom error class (extends `Error`) for all tsparser failures. The `name` property is set to `"TsParserError"`.

### Types

```typescript
type TokenKind = "number" | "plus" | "minus" | "star" | "slash"
               | "percent" | "caret" | "lparen" | "rparen" | "eof";

interface Token { kind: TokenKind; value: string; }

type ASTNode = NumberLiteral | UnaryExpression | BinaryExpression;

interface NumberLiteral { type: "NumberLiteral"; value: number; }
interface UnaryExpression { type: "UnaryExpression"; operator: "+" | "-"; operand: ASTNode; }
interface BinaryExpression { type: "BinaryExpression"; operator: "+" | "-" | "*" | "/" | "%" | "^"; left: ASTNode; right: ASTNode; }
```

## Running Tests

```bash
npm test                # run tests
npm run test:coverage   # run tests with coverage report
```

## License

MIT
