import { XpellaParserVariableHeader } from './XpellaParserVariableHeader';
import { XpellaASTFunctionDeclaration } from '../../AST/XpellaASTFunctionDeclaration';

export class XpellaParserFunctionHeader extends XpellaParserVariableHeader {
  public static fromDeclaration(declaration: XpellaASTFunctionDeclaration): XpellaParserFunctionHeader {
    return new XpellaParserFunctionHeader(
      declaration.identifier,
      declaration.returnType,
      declaration.args.map((arg) => ({ type: arg.type, hasDefault: !!arg.initialAssignation })),
      declaration.visibility,
      declaration.modifiers
    );
  }

  public returnType: string;
  /** The array of the types to provide as arguments */
  public args: Array<{ type: string, hasDefault: boolean }>;

  constructor(identifier: string,
              returnType: string,
              args: Array<{ type: string, hasDefault: boolean }>,
              visibility: string,
              modifiers: string[]) {
    super(identifier, 'function', visibility, modifiers);
    this.returnType = returnType;
    this.args = args;
  }
}
