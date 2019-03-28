export abstract class XpellaParserVariableHeader {
  public identifier: string;
  public type: string;
  public visibility: string;
  public modifiers: string[];

  constructor(identifier: string, type: string, visibility: string, modifiers: string[]) {
    this.identifier = identifier;
    this.type = type;
    this.visibility = visibility;
    this.modifiers = modifiers;
  }
}
