import { parse, TsParserError } from "../src";
import type { ASTNode } from "../src";

describe("parse", () => {
  // ââ Number literals ââââââââââââââââââââââââââââââââââââââââââââââ

  it("parses a single integer", () => {
    expect(parse("42")).toEqual({ type: "NumberLiteral", value: 42 });
  });

  it("parses a decimal number", () => {
    expect(parse("3.14")).toEqual({ type: "NumberLiteral", value: 3.14 });
  });

  // ââ Binary expressions ââââââââââââââââââââââââââââââââââââââââââ

  it("parses addition", () => {
    const ast = parse("1 + 2");
    expect(ast).toEqual({
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1 },
      right: { type: "NumberLiteral", value: 2 },
    });
  });

  it("parses subtraction", () => {
    const ast = parse("5 - 3");
    expect(ast.type).toBe("BinaryExpression");
    if (ast.type === "BinaryExpression") {
      expect(ast.operator).toBe("-");
    }
  });

  it("parses multiplication", () => {
    const ast = parse("2 * 3");
    expect(ast.type).toBe("BinaryExpression");
    if (ast.type === "BinaryExpression") {
      expect(ast.operator).toBe("*");
    }
  });

  it("parses division", () => {
    const ast = parse("6 / 2");
    expect(ast.type).toBe("BinaryExpression");
    if (ast.type === "BinaryExpression") {
      expect(ast.operator).toBe("/");
    }
  });

  it("parses modulo", () => {
    const ast = parse("7 % 3");
    expect(ast.type).toBe("BinaryExpression");
    if (ast.type === "BinaryExpression") {
      expect(ast.operator).toBe("%");
    }
  });

  it("parses exponentiation", () => {
    const ast = parse("2 ^ 3");
    expect(ast.type).toBe("BinaryExpression");
    if (ast.type === "BinaryExpression") {
      expect(ast.operator).toBe("^");
    }
  });

  // ââ Precedence ââââââââââââââââââââââââââââââââââââââââââââââââââ

  it("respects multiplication over addition precedence", () => {
    const ast = parse("1 + 2 * 3") as any;
    expect(ast.type).toBe("BinaryExpression");
    expect(ast.operator).toBe("+");
    expect(ast.right.type).toBe("BinaryExpression");
    expect(ast.right.operator).toBe("*");
  });

  it("respects exponent over multiplication precedence", () => {
    const ast = parse("2 * 3 ^ 4") as any;
    expect(ast.operator).toBe("*");
    expect(ast.right.operator).toBe("^");
  });

  it("exponentiation is right-associative", () => {
    const ast = parse("2 ^ 3 ^ 4") as any;
    expect(ast.operator).toBe("^");
    expect(ast.right.operator).toBe("^");
    expect(ast.right.left.value).toBe(3);
  });

  it("left-associative addition", () => {
    const ast = parse("1 + 2 + 3") as any;
    expect(ast.operator).toBe("+");
    expect(ast.left.operator).toBe("+");
  });

  // ââ Unary expressions ââââââââââââââââââââââââââââââââââââââââââ

  it("parses unary minus", () => {
    const ast = parse("-5");
    expect(ast).toEqual({
      type: "UnaryExpression",
      operator: "-",
      operand: { type: "NumberLiteral", value: 5 },
    });
  });

  it("parses unary plus", () => {
    const ast = parse("+5");
    expect(ast).toEqual({
      type: "UnaryExpression",
      operator: "+",
      operand: { type: "NumberLiteral", value: 5 },
    });
  });

  it("parses double unary minus", () => {
    const ast = parse("--5") as any;
    expect(ast.type).toBe("UnaryExpression");
    expect(ast.operator).toBe("-");
    expect(ast.operand.type).toBe("UnaryExpression");
    expect(ast.operand.operator).toBe("-");
  });

  // ââ Parentheses âââââââââââââââââââââââââââââââââââââââââââââââââ

  it("parses parenthesized expression", () => {
    const ast = parse("(1 + 2)") as any;
    expect(ast.type).toBe("BinaryExpression");
    expect(ast.operator).toBe("+");
  });

  it("parses nested parentheses", () => {
    const ast = parse("((1 + 2))") as any;
    expect(ast.type).toBe("BinaryExpression");
    expect(ast.operator).toBe("+");
  });

  it("parentheses override precedence", () => {
    const ast = parse("(1 + 2) * 3") as any;
    expect(ast.operator).toBe("*");
    expect(ast.left.operator).toBe("+");
  });

  // ââ Error paths ââââââââââââââââââââââââââââââââââââââââââââââââââ

  it("throws on empty input", () => {
    expect(() => parse("")).toThrow("input must not be empty");
  });

  it("throws on whitespace-only input", () => {
    expect(() => parse("   ")).toThrow("input must not be empty");
  });

  it("throws on non-string input", () => {
    expect(() => parse(123 as unknown as string)).toThrow("input must be a string");
  });

  it("throws on unmatched opening parenthesis", () => {
    expect(() => parse("(1 + 2")).toThrow("Expected closing parenthesis");
  });

  it("throws on unmatched closing parenthesis", () => {
    expect(() => parse("1 + 2)")).toThrow("Unexpected token ')'");
  });

  it("throws on trailing operator", () => {
    expect(() => parse("1 +")).toThrow("Unexpected end of input");
  });

  it("throws on consecutive operators without unary meaning", () => {
    expect(() => parse("1 * * 2")).toThrow("Unexpected token '*'");
  });

  it("throws on just an operator", () => {
    expect(() => parse("*")).toThrow("Unexpected token '*'");
  });
});
