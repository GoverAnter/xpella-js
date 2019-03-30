import { XpellaRuntimeVariableMetadatas } from './XpellaRuntimeVariableMetadatas';
import { XpellaRuntimeType } from './types/XpellaRuntimeType';
import { XpellaRuntimeVisibility } from './XpellaRuntimeVisibility';
import { XpellaRuntimeHandler } from './XpellaRuntimeHandler';
import { XpellaASTVariableDeclaration } from '../../AST/XpellaASTVariableDeclaration';
import { runtimizeExpression } from '../XpellaRuntimizer';

export class XpellaRuntimeFunctionArgument extends XpellaRuntimeVariableMetadatas {
  public static fromAST(arg: XpellaASTVariableDeclaration): XpellaRuntimeFunctionArgument {
    return new XpellaRuntimeFunctionArgument(arg.identifier,
                                             arg.type,
                                             arg.initialAssignation ?
                                              runtimizeExpression(arg.initialAssignation) : null);
  }

  public initialValue: XpellaRuntimeHandler = null;

  constructor(identifier: string,
              type: string,
              initialValue?: XpellaRuntimeHandler) {
    super(identifier, type, XpellaRuntimeVisibility.PUBLIC);

    this.initialValue = initialValue;
  }

  public hasInitialValue(): boolean {
    return this.initialValue === null;
  }
}
