import { XpellaParserVariableHeader } from './XpellaParserVariableHeader';
import { XpellaASTVariableDeclaration } from '../../AST/XpellaASTVariableDeclaration';

export class XpellaParserMemberHeader extends XpellaParserVariableHeader {
  public static fromDeclaration(declaration: XpellaASTVariableDeclaration): XpellaParserMemberHeader {
    return new XpellaParserMemberHeader
      (declaration.identifier, declaration.type, declaration.visibility, declaration.modifiers);
  }

  constructor(identifier: string, type: string, visibility: string, modifiers: string[]) {
    super(identifier, type, visibility, modifiers);
  }
}
