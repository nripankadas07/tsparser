/**
 * AST evaluator: walks the parsed AST and computes a numeric result.
 */

import { ASTNode } from "./types";
import { TsParserError } from "./errors";
import { parse } from "./parser";

/**
 * Parse and evaluate an arithmetic expression string to a number.
 *
 * Supports: +, -, *, /, % (modulo), ^ (exponentiation), unary +/-,
 * and parenthesized sub-expressions.
 *
 * @throws TsParserError for syntax errors or division/modulo by zero.
 */
export function evaluate(input: string): number {
  const ast = parse(input);
  return evaluateNode(ast);
}

function evaluateNode(node: ASTNode): number {
  if (node.type === "NumberLiteral") {
    return node.value;
  }

  if (node.type === "UnaryExpression") {
    return evaluateUnary(node.operator, evaluateNode(node.operand));
  }

  return evaluateBinary(
    node.operator,
    evaluateNode(node.left),
    evaluateNode(node.right),
  );
}

function evaluateUnary(operator: "+" | "-", operand: number): number {
  return operator === "-" ? -operand : operand;
}

function evaluateBinary(
  operator: "+" | "-" | "*" | "/" | "%" | "^",
  left: number,
  right: number,
): number {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) {
        throw new TsParserError("Division by zero");
      }
      return left / right;
    case "%":
      if (right === 0) {
        throw new TsParserError("Modulo by zero");
      }
      return left % right;
    case "^":
      return Math.pow(left, right);
  }
}
