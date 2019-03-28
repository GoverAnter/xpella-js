export class XpellaParserWarning {
  private message: string;
  private line: number;
  private col: number;

  constructor(message: string, lineNumber: number, columnNumber: number) {
    this.message = message;
    this.line = lineNumber;
    this.col = columnNumber;
  }

  public getMessage(): string { return this.message; }
  public getLineNumber(): number { return this.line; }
  public getColumnNumber(): number { return this.col; }
}
