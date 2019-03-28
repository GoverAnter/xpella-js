import { XpellaParserFunctionHeader } from './XpellaParserFunctionHeader';
import { XpellaParserMemberHeader } from './XpellaParserMemberHeader';
import { XpellaASTTypeDeclaration } from '../../AST/XpellaASTTypeDeclaration';
import { XpellaParserOperatorFunctionPrefix } from '../Definitions/XpellaKeywords';

export class XpellaParserTypeHeader {
  public static fromDeclaration(declaration: XpellaASTTypeDeclaration): XpellaParserTypeHeader {
    const methods: XpellaParserFunctionHeader[] =
    declaration.methods.map((method) => XpellaParserFunctionHeader.fromDeclaration(method));
    return new XpellaParserTypeHeader(
      declaration.identifier,
      declaration.members
        .filter((member) => member.visibility !== 'private')
        .map((member) => XpellaParserMemberHeader.fromDeclaration(member)),
      methods.filter((method) => !method.identifier.startsWith(XpellaParserOperatorFunctionPrefix)),
      methods.filter((method) => method.identifier.startsWith(XpellaParserOperatorFunctionPrefix))
        .map((method) => method.identifier = method.identifier
          .slice(XpellaParserOperatorFunctionPrefix.length, method.identifier.length))
    );
  }

  public identifier: string;
  public members: XpellaParserMemberHeader[];
  public methods: XpellaParserFunctionHeader[];
  public operators: { [operator: string]: any };

  constructor(identifier: string,
              members: XpellaParserMemberHeader[],
              methods: XpellaParserFunctionHeader[],
              operators: { [operator: string]: any }) {
    this.identifier = identifier;
    this.members = members;
    this.methods = methods;
    this.operators = operators;
  }
}
