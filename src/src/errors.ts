/**
 * Custom error class for all tsparser failures:
 * tokenization errors, parse errors, and evaluation errors.
 */
export class TsParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TsParserError";
  }
}
