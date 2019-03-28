import { XpellaParserOptions } from '../XpellaParserOptions';

export class XpellaInputStream {
  private code: string;
  private currentPosition: number = 0;
  private currentLine: number = 1;
  private currentColumn: number = 0;
  private lineColumns: number[] = [];

  constructor(code: string, options: XpellaParserOptions = new XpellaParserOptions()) {
    this.code = code;
  }

  public next(): string {
    if (this.isEof()) {
      return undefined;
    } else {
      const char = this.code.charAt(this.currentPosition);
      this.currentPosition++;
      if (char === '\n') {
        this.lineColumns[this.currentLine] = this.currentColumn;
        this.currentLine++;
        this.currentColumn = 0;
      } else {
        this.currentColumn++;
      }
      return char;
    }
  }
  public peek(): string {
    if (this.isEof()) {
      return undefined;
    } else {
      return this.code.charAt(this.currentPosition);
    }
  }
  public peekTo(toAdd: number): string {
    if (this.currentPosition + toAdd > this.code.length) {
      return undefined;
    } else {
      return this.code.charAt(this.currentPosition + toAdd);
    }
  }
  public peekBack(): string {
    if (this.currentPosition === 0) {
      return undefined;
    } else {
      return this.code.charAt(this.currentPosition - 1);
    }
  }
  public isEof(): boolean {
    return this.code.length === this.currentPosition;
  }
  public throw(error: string, toRewind: number = 0) {
    if (toRewind > 0) {
      this.rewind(this.currentPosition - toRewind);
    }
    throw new Error(error + ' (line ' + this.currentLine + ', col ' + this.currentColumn + ')');
  }
  public getCurrentPosition(): number { return this.currentPosition; }
  public getCurrentLine(): number { return this.currentLine; }
  public getCurrentColumn(): number { return this.currentColumn; }

  public rewind(toPosition: number): void {
    toPosition = toPosition < 0 ? 0 : toPosition;
    while (this.currentPosition !== toPosition) {
      this.currentPosition--;
      if (this.peek() === '\n') {
        this.currentLine--;
        this.currentColumn = this.lineColumns[this.currentLine];
      } else {
        this.currentColumn--;
      }
    }
  }
}
