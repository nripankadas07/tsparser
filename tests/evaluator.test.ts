import { evaluate, TsParserError } from "../src";

describe("evaluate", () => {
  // ââ Basic arithmetic ââââââââââââââââââââââââââââââââââââââââââââââ

  it("evaluates a single number", () => {
    expect(evaluate("42")).toBe(42);
  });

  it("evaluates addition", () => {
    expect(evaluate("1 + 2")).toBe(3);
  });

  it("evaluates subtraction", () => {
    expect(evaluate("10 - 3")).toBe(7);
  });

  it("evaluates multiplication", () => {
    expect(evaluate("4 * 5")).toBe(20);
  });

  it("evaluates division", () => {
    expect(evaluate("10 / 4")).toBe(2.5);
  });

  it("evaluates modulo", () => {
    expect(evaluate("7 % 3")).toBe(1);
  });

  it("evaluates exponentiation", () => {
    expect(evaluate("2 ^ 10")).toBe(1024);
  });

  // ââ Precedence and associativity ââââââââââââââââââââââââââââââââââ

  it("respects operator precedence: 2 + 3 * 4 = 14", () => {
    expect(evaluate("2 + 3 * 4")).toBe(14);
  });

  it("respects parentheses: (2 + 3) * 4 = 20", () => {
    expect(evaluate("(2 + 3) * 4")).toBe(20);
  });

  it("right-associative exponent: 2 ^ 3 ^ 2 = 512", () => {
    expect(evaluate("2 ^ 3 ^ 2")).toBe(512);
  });

  it("nested parentheses: ((1 + 2) * (3 + 4)) = 21", () => {
    expect(evaluate("((1 + 2) * (3 + 4))")).toBe(21);
  });

  it("complex expression: (10 - 2) * 3 + 4 / 2 = 26", () => {
    expect(evaluate("(10 - 2) * 3 + 4 / 2")).toBe(26);
  });

  // ââ Unary operators âââââââââââââââââââââââââââââââââââââââââââââââ

  it("evaluates unary minus", () => {
    expect(evaluate("-5")).toBe(-5);
  });

  it("evaluates unary plus", () => {
    expect(evaluate("+5")).toBe(5);
  });

  it("evaluates double unary minus", () => {
    expect(evaluate("--5")).toBe(5);
  });

  it("evaluates unary minus in expression: -3 + 7 = 4", () => {
    expect(evaluate("-3 + 7")).toBe(4);
  });

  it("evaluates negative times negative: (-2) * (-3) = 6", () => {
    expect(evaluate("(-2) * (-3)")).toBe(6);
  });

  // ââ Decimal numbers âââââââââââââââââââââââââââââââââââââââââââââââ

  it("evaluates decimal addition", () => {
    expect(evaluate("0.1 + 0.2")).toBeCloseTo(0.3);
  });

  it("evaluates .5 as 0.5", () => {
    expect(evaluate(".5 + .5")).toBe(1);
  });

  // ââ Edge cases ââââââââââââââââââââââââââââââââââââââââââââââââââââ

  it("evaluates zero", () => {
    expect(evaluate("0")).toBe(0);
  });

  it("evaluates zero exponent", () => {
    expect(evaluate("5 ^ 0")).toBe(1);
  });

  it("evaluates modulo with negative left operand", () => {
    expect(evaluate("-7 % 3")).toBe(-1);
  });

  it("evaluates large exponent", () => {
    expect(evaluate("10 ^ 6")).toBe(1_000_000);
  });

  // ââ Error paths âââââââââââââââââââââââââââââââââââââââââââââââââââ

  it("throws on division by zero", () => {
    expect(() => evaluate("1 / 0")).toThrow(TsParserError);
    expect(() => evaluate("1 / 0")).toThrow("Division by zero");
  });

  it("throws on modulo by zero", () => {
    expect(() => evaluate("5 % 0")).toThrow("Modulo by zero");
  });

  it("throws on empty input", () => {
    expect(() => evaluate("")).toThrow("input must not be empty");
  });

  it("throws on invalid expression", () => {
    expect(() => evaluate("abc")).toThrow(TsParserError);
  });
});
