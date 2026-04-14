import { tokenize, TsParserError } from "../src";

describe("tokenize", () => {
  // ââ Happy paths ââââââââââââââââââââââââââââââââââââââââââââââââââ

  it("tokenizes a single integer", () => {
    const tokens = tokenize("42");
    expect(tokens).toEqual([
      { kind: "number", value: "42" },
      { kind: "eof", value: "" },
    ]);
  });

  it("tokenizes a decimal number", () => {
    const tokens = tokenize("3.14");
    expect(tokens).toEqual([
      { kind: "number", value: "3.14" },
      { kind: "eof", value: "" },
    ]);
  });

  it("tokenizes a number starting with dot", () => {
    const tokens = tokenize(".5");
    expect(tokens).toEqual([
      { kind: "number", value: ".5" },
      { kind: "eof", value: "" },
    ]);
  });

  it("tokenizes all operator types", () => {
    const tokens = tokenize("+-*/%^");
    expect(tokens.map((t) => t.kind)).toEqual([
      "plus", "minus", "star", "slash", "percent", "caret", "eof",
    ]);
  });

  it("tokenizes parentheses", () => {
    const tokens = tokenize("(1)");
    expect(tokens.map((t) => t.kind)).toEqual([
      "lparen", "number", "rparen", "eof",
    ]);
  });

  it("tokenizes a complex expression", () => {
    const tokens = tokenize("(1 + 2) * 3.5");
    expect(tokens).toEqual([
      { kind: "lparen", value: "(" },
      { kind: "number", value: "1" },
      { kind: "plus", value: "+" },
      { kind: "number", value: "2" },
      { kind: "rparen", value: ")" },
      { kind: "star", value: "*" },
      { kind: "number", value: "3.5" },
      { kind: "eof", value: "" },
    ]);
  });

  it("skips whitespace correctly", () => {
    const tokens = tokenize("  1  +  2  ");
    expect(tokens).toEqual([
      { kind: "number", value: "1" },
      { kind: "plus", value: "+" },
      { kind: "number", value: "2" },
      { kind: "eof", value: "" },
    ]);
  });

  it("skips tabs and newlines", () => {
    const tokens = tokenize("1\t+\n2");
    expect(tokens.length).toBe(4);
  });

  it("tokenizes empty string to just EOF", () => {
    const tokens = tokenize("");
    expect(tokens).toEqual([{ kind: "eof", value: "" }]);
  });

  it("tokenizes whitespace-only to just EOF", () => {
    const tokens = tokenize("   \t\n  ");
    expect(tokens).toEqual([{ kind: "eof", value: "" }]);
  });

  it("tokenizes a number ending with dot like '5.'", () => {
    const tokens = tokenize("5.");
    expect(tokens).toEqual([
      { kind: "number", value: "5." },
      { kind: "eof", value: "" },
    ]);
  });

  // ââ Error paths ââââââââââââââââââââââââââââââââââââââââââââââââââ

  it("throws on unknown character", () => {
    expect(() => tokenize("1 + a")).toThrow(TsParserError);
    expect(() => tokenize("1 + a")).toThrow("Unexpected character 'a'");
  });

  it("throws on multiple decimal points", () => {
    expect(() => tokenize("1.2.3")).toThrow(TsParserError);
    expect(() => tokenize("1.2.3")).toThrow("multiple decimal points");
  });

  it("throws on lone decimal point", () => {
    expect(() => tokenize(". + 1")).toThrow("lone decimal point");
  });

  it("throws on non-string input", () => {
    expect(() => tokenize(42 as unknown as string)).toThrow("input must be a string");
  });

  it("throws on special characters like @", () => {
    expect(() => tokenize("@")).toThrow("Unexpected character '@'");
  });
});
