import { XpellaRuntimeVisibility, parserVisibilityToRuntimeVisibility } from './XpellaRuntimeVisibility';
import { XpellaRuntimeType } from './XpellaRuntimeType';
import { XpellaRuntimeFunctionArgument } from './XpellaRuntimeFunctionArgument';
import { XpellaRuntimeHandler } from './XpellaRuntimeHandler';
import { XpellaASTFunctionDeclaration } from '../../AST/XpellaASTFunctionDeclaration';
import { runtimizeBlock } from '../XpellaRuntimizer';
import { XpellaRuntimeContext } from './context/XpellaRuntimeContext';
import { XpellaRuntimeVariable } from './XpellaRuntimeVariable';

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

  public call(context: XpellaRuntimeContext, args: XpellaRuntimeVariable[], prepareArgs: boolean = true): any {
    if (prepareArgs) {
      // This should be done compile-time, but we may need to do it runtime in some places
      args = this.prepareArgs(args, context);
    }

    context.createMaskingScope(args);

    this.handler(context);

    context.removeMaskingScope();
  }

  /**
   * Transforms an array of variables (the arguments of the method) to the arguments themselves.
   * The return array will then be used when calling a function to create the masking scope.
   * Context argument is only here when there are defaults : these defaults are handlers that must be executed to get the initial value.
   */
  public prepareArgs(args: XpellaRuntimeVariable[], context: XpellaRuntimeContext) : XpellaRuntimeVariable[] {
    // Prepare arguments (create new variables from them to assign them their scoped identifier)
    let preparedArgs: XpellaRuntimeVariable[] = [];

    for (const id in this.args) {
      const arg = this.args[id];
      preparedArgs.push(new XpellaRuntimeVariable(arg.identifier,
        arg.type,
        XpellaRuntimeVisibility.PUBLIC,
        args[id] ? args[id].value : arg.initialValue(context)));
    }

    return preparedArgs;
  }
}
