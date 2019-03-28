import { XpellaInputStream } from './XpellaInputStream';
import {
  XpellaParserLineDelimiter,
  XpellaParserObjectAccessor,
  XpellaParserComments,
  XpellaParserBackOperators,
  XpellaParserFrontOperators,
  XpellaParserExpressionOperators,
  XpellaParserStatementOperators
} from '../Definitions/XpellaKeywords';
import { XpellaParserOptions } from '../XpellaParserOptions';

// Exception codes:
// Current file: XP00xx
// Last exception: XP0003
export class XpellaLexer {
  private options: XpellaParserOptions;
  private inputStream: XpellaInputStream;

  constructor(inputStream: XpellaInputStream, options: XpellaParserOptions = new XpellaParserOptions()) {
    this.inputStream = inputStream;
    this.options = options;
  }

  public isWhitespace(character: string): boolean {
    return /\s/.test(character);
  }
  public isNextWhitespace(): boolean {
    return this.isWhitespace(this.inputStream.peek());
  }
  public isBlockDelimiter(character: string): boolean {
    return /(\[|]|{|}|\(|\))/.test(character);
  }
  public isNextBlockDelimiter(): boolean {
    return this.isBlockDelimiter(this.inputStream.peek());
  }
  public isLineDelimiter(character: string): boolean {
    return character === XpellaParserLineDelimiter;
  }
  public isNextLineDelimiter(): boolean {
    return this.isLineDelimiter(this.inputStream.peek());
  }
  public isSimpleDelimiter(character: string): boolean {
    return character === ',';
  }
  public isNextSimpleDelimiter(): boolean {
    return this.isSimpleDelimiter(this.inputStream.peek());
  }
  public isObjectAccessor(character: string): boolean {
    return character === XpellaParserObjectAccessor;
  }
  public isStatementOperator(word: string): boolean {
    return XpellaParserStatementOperators.some((op: string) => op === word);
  }
  public isExpressionOperator(word: string): boolean {
    return !!XpellaParserExpressionOperators[word];
  }
  public isBackOperator(word: string): boolean {
    return XpellaParserBackOperators.some((op: string) => op === word);
  }
  public isFrontOperator(word: string): boolean {
    return XpellaParserFrontOperators.some((op: string) => op === word);
  }
  public isOperator(character: string): boolean {
    return ['+', '-', '=', '/', '*', '&', '|', '<', '>', ':', '?', '!', '^', '%', '~']
      .some((op: string) => op === character);
  }
  public isWordBreak(character: string): boolean {
    return this.isWhitespace(character) ||
      this.isBlockDelimiter(character) ||
      this.isLineDelimiter(character) ||
      this.isObjectAccessor(character) ||
      this.isSimpleDelimiter(character) ||
      this.isOperator(character);
  }

  public readWhile(predicate: (current: string, last: string) => boolean): string {
    let str = '';
    let last = '';
    while (!this.inputStream.isEof() && predicate(this.inputStream.peek(), last)) {
      last = this.inputStream.next();
      str += last;
    }
    return str;
  }
  public discardWhile(predicate: (current: string, last: string) => boolean): void {
    let last = '';
    while (!this.inputStream.isEof() && predicate(this.inputStream.peek(), last)) {
      last = this.inputStream.next();
    }
  }

  public readWord(): string {
    return this.readWhile((char: string) => !this.isWordBreak(char));
  }
  public readBlock(endDelimiter: string): string {
    return this.readWhile((char: string) => char !== endDelimiter);
  }
  public discardBlock(endDelimiter: string): void {
    this.discardWhile((char: string) => char !== endDelimiter);
  }

  public readOperator(): string {
    return this.readWhile((char: string) => this.isOperator(char));
  }

  public eatChar(char: string): void {
    if (this.inputStream.peek() !== char) {
      this.inputStream.throw('XP0000: Expected "' + char + '", got "' + this.inputStream.peek() + '"');
    } else {
      this.inputStream.next();
    }
  }
  public eatWord(word: string): void {
    const red = this.readWord();
    if (red !== word) {
      this.inputStream.throw('XP0001: Expected "' + word + '", got "' + red + '"', red.length);
    }
  }

  public readSingleLineComment(): string {
    return this.readBlock('\n');
  }
  public readMultiLineComment(): string {
    return this.readBlock(XpellaParserComments.XpellaParserMultiLineEndComment);
  }
  public readDocumentation(): string {
    return this.readBlock(XpellaParserComments.XpellaParserMultiLineStartDocumentation);
  }

  public discardSingleLineComment(): void {
    this.discardBlock('\n');
  }
  public discardMultiLineComment(): void {
    this.discardBlock(XpellaParserComments.XpellaParserMultiLineEndComment);
  }
  public discardDocumentation(): void {
    this.discardBlock(XpellaParserComments.XpellaParserMultiLineEndDocumentation);
  }

  public skipChar(char: string): void {
    if (this.inputStream.peek() === char) {
      this.inputStream.next();
    } else {
      this.inputStream.throw('XP0002: Expected "' + char + '"');
    }
  }

  public skipWhitespaces(atLeastOne: boolean = true): void {
    if (atLeastOne && !this.isNextWhitespace()) {
      this.inputStream.throw('XP0003: Expected whitespace');
    } else {
      while (!this.inputStream.isEof() && this.isNextWhitespace()) {
        this.inputStream.next();
      }
    }
  }
}
