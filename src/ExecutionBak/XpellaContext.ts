import { XpellaVariable } from './Definitions/XpellaVariable';
import { DeclarationError, DeclarationErrors } from '../Errors/DeclarationError';
import { XpellaScopeError, XpellaScopeErrors } from '../Errors/XpellaScopeError';

export class XpellaContext {
  private memory: { [name: string]: any } = {};

  private functionScopes: Array<{ [name: string]: any }> = [];
  private objectScopes: string[] = [];

  public currentlyFunctionScoped(): boolean {
    return this.functionScopes.length !== 0;
  }
  public currentFunctionScopeId(): number {
    return this.functionScopes.length - 1;
  }
  public currentFunctionScope(): { [name: string]: any } {
    if (!this.currentlyFunctionScoped()) {
      return undefined;
    } else {
      return this.functionScopes[this.currentFunctionScopeId()];
    }
  }
  public currentlyObjectScoped(): boolean {
    return this.objectScopes.length !== 0;
  }
  public currentObjectScopeId(): number {
    return this.objectScopes.length - 1;
  }
  public currentObjectScope(): string {
    if (!this.currentlyObjectScoped()) {
      return undefined;
    } else {
      return this.objectScopes[this.currentObjectScopeId()];
    }
  }
  public createFunctionScope(toBind: XpellaVariable[], objectScope?: string): void {
    const functionScope: { [name: string]: any } = {};
    toBind.forEach((variable) => { functionScope[variable.getIdentifier()] = variable; });
    this.functionScopes.push(functionScope);

    this.objectScopes.push(objectScope);
  }
  public destroyFunctionScope(): void {
    if (this.currentlyFunctionScoped()) {
      this.functionScopes.pop();
      this.objectScopes.pop();
    }
  }

  public getMemoryValue(identifier: string): XpellaVariable {
    if (this.currentlyFunctionScoped()) {
      // First check in the function scope if we have the requested variable
      const fVal = this.currentFunctionScope()[identifier];
      if (fVal) {
        return fVal;
      }
    }

    const val = this.memory[identifier];
    if (val === undefined) {
      throw new DeclarationError(identifier, DeclarationErrors.UNDECLARED);
    } else {
      return val;
    }
  }
  public declareMemoryValue(identifier: string, value: XpellaVariable): void {
    // Cannot redeclare a value
    if (this.existsInMemory(identifier)) {
      throw new DeclarationError(identifier, DeclarationErrors.REDECLARED);
    } else {
      this.memory[identifier] = value;
    }
  }
  public assignMemoryValue(identifier: string, value: XpellaVariable): void {
    if (identifier === 'this') {
      // We MUST have an object scope in order to provide "this" a value
      if (!this.currentlyObjectScoped()) {
        throw new XpellaScopeError(XpellaScopeErrors.THIS_UNAVAILABLE);
      } else {
        // Try to assign the value to "this"
        identifier = this.currentObjectScope();
      }
    }
    // Cannot assign an undeclared variable
    if (!this.existsInMemory(identifier)) {
      throw new DeclarationError(identifier, DeclarationErrors.UNDECLARED);
    } else {
      this.memory[identifier].getType().assignFrom(this.memory[identifier], value);
    }
  }
  public existsInMemory(identifier: string): boolean {
    return this.memory[identifier] !== undefined;
  }
}
