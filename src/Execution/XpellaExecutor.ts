import { XpellaASTProgram } from '../AST/XpellaASTProgram';
import { XpellaRuntimeContext } from './XpellaRuntimeContext';
import { XpellaRuntimeFunction } from './Runtime/XpellaRuntimeFunction';
import { XpellaRuntimeType } from './Runtime/XpellaRuntimeType';

export class XpellaExecutor {
  public originalAST: XpellaASTProgram;
  private executionHandler: (context: XpellaRuntimeContext) => any;
  private types: { [typeName: string]: XpellaRuntimeType } = {};

  constructor(ast: XpellaASTProgram, libraries: XpellaRuntimeType[][]) {
    this.originalAST = ast;

    libraries.forEach((lib) => {
      lib.forEach((type) => this.types[type.identifier] = type);
    });

    this.recreateExecutionHandler();
  }

  /**
   * This method retriggers an AST parse to create the execution handler method.
   */
  public recreateExecutionHandler() {
    for (const type of this.originalAST.types) {
      const constructors: XpellaRuntimeFunction[] = [];
      const operators: XpellaRuntimeFunction[] = [];
      const methods: XpellaRuntimeFunction[] = [];

      for (const method of type.methods) {
        const func = XpellaRuntimeFunction.fromAST(method);
        if (func.identifier === type.identifier) {
          constructors.push(func);
        } else if (/^\W+$/.test(func.identifier)) {
          operators.push(func);
        } else {
          methods.push(func);
        }
      }
    }
  }

  public run(context: XpellaRuntimeContext): any {
    return this.executionHandler(context);
  }
}
