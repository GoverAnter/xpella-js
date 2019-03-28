import { XpellaType } from "./XpellaType";
import { XpellaContext } from "../XpellaContext";
import { XpellaVariable } from "./XpellaVariable";
import { XpellaScope } from "./XpellaScope";
import { XpellaVariableMetadatas } from "./XpellaVariableMetadatas";

export class XpellaFunction {
  private handler: Function;
  private identifier: string;
  private scope: XpellaScope;
  private returnType: XpellaType;
  private args: Array<XpellaVariableMetadatas>;

  constructor (handler: Function, identifier: string, scope: XpellaScope, returnType: XpellaType, args: Array<XpellaVariableMetadatas>) {
    this.handler = handler;
    this.identifier = identifier;
    this.scope = scope;
    this.returnType = returnType;
    this.args = args;
  }

  call (context: XpellaContext, args: Array<XpellaVariable>, thisIdentifier: string = null, prepareArgs: boolean = true) : any {
    // If we need, prepare args
    if (prepareArgs) {
      args = this.prepareArgs(args);
    }
    
    // Bind args to the context
    context.createFunctionScope(args, thisIdentifier);

    // Call the handler
    this.handler(context);

    // Destroy the function context
    context.destroyFunctionScope();
  }

  prepareArgs (args: Array<XpellaVariable>) : Array<XpellaVariable> {
    // Prepare arguments (create new variables from them to assign them their scoped identifier)
    let preparedArgs: Array<XpellaVariable> = [];

    for (let id in this.getArgs()) {
      let constrArg = this.getArgs()[id];
      preparedArgs.push(new XpellaVariable(constrArg.getIdentifier(), args[id].value, constrArg.getType(), XpellaScope.LOCAL));
    }

    return preparedArgs;
  }

  getIdentifier () : string {
    return this.identifier;
  }
  getScope () : XpellaScope {
    return this.scope;
  }
  getReturnType () : XpellaType {
    return this.returnType;
  }
  getArgs () : Array<XpellaVariableMetadatas> {
    return this.args;
  }
}