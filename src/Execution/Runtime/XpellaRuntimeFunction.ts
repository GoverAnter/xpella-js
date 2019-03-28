import { XpellaRuntimeVisibility, parserVisibilityToRuntimeVisibility } from './XpellaRuntimeVisibility';
import { XpellaRuntimeType } from './XpellaRuntimeType';
import { XpellaRuntimeFunctionArgument } from './XpellaRuntimeFunctionArgument';
import { XpellaRuntimeHandler } from './XpellaRuntimeHandler';
import { XpellaASTFunctionDeclaration } from '../../AST/XpellaASTFunctionDeclaration';
import { runtimizeBlock } from '../XpellaRuntimizer';

export class XpellaRuntimeFunction {
  public static fromAST(func: XpellaASTFunctionDeclaration): XpellaRuntimeFunction {
    return new XpellaRuntimeFunction(func.identifier,
                                     parserVisibilityToRuntimeVisibility(func.visibility),
                                     func.returnType,
                                     runtimizeBlock(func.execution),
                                     func.args.map((arg) => XpellaRuntimeFunctionArgument.fromAST(arg)));
  }

  public identifier: string;
  public visibility: XpellaRuntimeVisibility;
  public returnType: string;
  public args: XpellaRuntimeFunctionArgument[];

  public handler: XpellaRuntimeHandler;

  constructor(identifier: string,
              visibility: XpellaRuntimeVisibility,
              returnType: string,
              handler: XpellaRuntimeHandler,
              args: XpellaRuntimeFunctionArgument[]) {
    this.identifier = identifier;
    this.visibility = visibility;
    this.returnType = returnType;
    this.args = args;

    this.handler = handler;
  }
}
