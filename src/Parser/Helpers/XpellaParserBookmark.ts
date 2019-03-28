import { XpellaInputStream } from './XpellaInputStream';

export class XpellaParserBookmark {
  public static fromInputStream(inputStream: XpellaInputStream): XpellaParserBookmark {
    return new XpellaParserBookmark(inputStream.getCurrentPosition(),
                                    inputStream.getCurrentLine(),
                                    inputStream.getCurrentColumn());
  }

  public readonly position: number;
  public readonly line: number;
  public readonly column: number;

  constructor(position: number, line: number, column: number) {
    this.position = position;
    this.line = line;
    this.column = column;
  }
}
