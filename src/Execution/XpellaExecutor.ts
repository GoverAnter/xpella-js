import { XpellaASTProgram } from '../AST/XpellaASTProgram';
import { XpellaRuntimeContext } from './XpellaRuntimeContext';
import { XpellaRuntimeFunction } from './Runtime/XpellaRuntimeFunction';
import { XpellaRuntimeType } from './Runtime/XpellaRuntimeType';

export interface RuntimeTypes { [typeName: string]: XpellaRuntimeType };

export class XpellaExecutor {
  public originalAST: XpellaASTProgram;
  private types: RuntimeTypes = {};

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

      this.types[type.identifier] = new XpellaRuntimeType([], type.identifier, constructors, operators, methods);
    }
  }

  public run(context: XpellaRuntimeContext, entryPoint: { type: string, method: string }, args: any[]): any {
    context.types = this.types;
    return this.types[entryPoint.type].methods.find((val) => val.identifier == entryPoint.method).handler(context);
  }
}
