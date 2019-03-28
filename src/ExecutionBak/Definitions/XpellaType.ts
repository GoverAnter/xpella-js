import { XpellaFunction } from "./XpellaFunction";
import { XpellaVariableMetadatas } from "./XpellaVariableMetadatas";
import { XpellaContext } from "../XpellaContext";
import { XpellaScope } from "./XpellaScope";
import { XpellaVariable } from "./XpellaVariable";
import { XpellaTypeError, XpellaTypeErrors } from "../Errors/XpellaTypeError";

export abstract class XpellaType {
  private members: Array<XpellaVariableMetadatas>;
  private constructors: Array<XpellaFunction>;
  private methods: Array<XpellaFunction>;
  private identifier: string;

  constructor (identifier: string, members: Array<XpellaVariableMetadatas>, methods: Array<XpellaFunction>) {
    this.identifier = identifier;
    this.members = members;

    this.constructors = [];
    this.methods = [];

    // Find all constructors, isolate them and remove them from the methods list
    for(let id in methods) {
      this.addFunction(methods[id]);
    }
  }

  getIdentifier () : string {
    return this.identifier;
  }

  isAssignableFrom (type: XpellaType) : boolean {
    return false;
  }
  assignFrom (instance: XpellaVariable, toBeAssigned: XpellaVariable) : void {
    if (this.constructor === toBeAssigned.getType().constructor) {
      this.assignFromSelf(instance, toBeAssigned);
    } else if (this.isAssignableFrom(toBeAssigned.getType())) {
    } else {
      throw new XpellaTypeError(this.getIdentifier(), [toBeAssigned.getType().getIdentifier()], XpellaTypeErrors.NOT_ASSIGNABLE);
    }
  }
  abstract assignFromSelf (instance: XpellaVariable, toBeAssigned: XpellaVariable) : void;

  protected addFunction (funct: XpellaFunction) : void {
    // A constructor is a method that has the same name as its type
    if (funct.getIdentifier() === this.getIdentifier()) {
      this.constructors.push(funct)
    } else {
      this.methods.push(funct)
    }
  }

  findMatchingConstructor (argTypes: Array<XpellaType>) : XpellaFunction {
    let matching = this.constructors.find(constr => {
      // Args types must match
      if (constr.getArgs().length === argTypes.length && argTypes.every((type, index) => constr.getArgs()[index].getType().constructor === type.constructor)) {
        return true;
      } else {
        return false;
      }
    })

    if (matching) {
      return matching;
    } else {
      throw new XpellaTypeError(this.getIdentifier(), argTypes.map(type => type.getIdentifier()), XpellaTypeErrors.NO_MATCHING_CONSTRUCTOR);
    }
  }

  /**
   * In this method, constructor will be resolved run time, see the other instantiate for a compile time resolution
   * @param context The context on which to instantiate this object
   * @param identifier The identifier (name) of the instance to create
   * @param scope The scope in which this instance will be in
   * @param constructorArgs The arguments to pass to the constructor call
   */
  instantiateRunTime (context: XpellaContext, identifier: string, scope: XpellaScope, constructorArgs: Array<XpellaVariable>) : XpellaVariable {
    let variable = new XpellaVariable(identifier, null, this, scope);
    // Declare the variable so that constructor can assign things using "this"
    context.declareMemoryValue(identifier, variable);
    // Find matching constructor
    let constructor = this.findMatchingConstructor(constructorArgs.map(arg => arg.getType()))

    // Finally call the constructor
    constructor.call(context, constructorArgs, identifier);
    return variable;
  }

  /**
   * Instantiate an instance of this time using compile time constructor resolution.
   * @param context The context on which to instantiate this object
   * @param identifier The identifier (name) of the instance to create
   * @param scope The scope in which this instance will be in
   * @param constructor The resolved constructor to call
   * @param preparedConstructorArgs The prepared arguments to pass to the constructor call, use constructor.prepareArgs
   */
  instantiateCompileTime (context: XpellaContext, identifier: string, scope: XpellaScope, constructor: XpellaFunction, preparedConstructorArgs: Array<XpellaVariable>) : XpellaVariable {
    let variable = new XpellaVariable(identifier, null, this, scope);
    // Declare the variable so that constructor can assign things using "this"
    context.declareMemoryValue(identifier, variable);
    
    // Finally call the constructor
    constructor.call(context, preparedConstructorArgs, identifier, false);
    return variable;
  }
}