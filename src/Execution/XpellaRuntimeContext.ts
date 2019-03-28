import { XpellaRuntimeVariable } from './Runtime/XpellaRuntimeVariable';

// Exception codes:
// Current file: XP10xx
// Last exception: XP1003
export class XpellaRuntimeContext {
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
  public createFunctionScope(toBind: XpellaRuntimeVariable[], objectScope?: string): void {
    const functionScope: { [name: string]: any } = {};
    toBind.forEach((variable) => { functionScope[variable.identifier] = variable; });
    this.functionScopes.push(functionScope);

    this.objectScopes.push(objectScope);
  }
  public destroyFunctionScope(): void {
    if (this.currentlyFunctionScoped()) {
      this.functionScopes.pop();
      this.objectScopes.pop();
    }
  }

  public getMemoryValue(identifier: string): XpellaRuntimeVariable {
    if (this.currentlyFunctionScoped()) {
      // First check in the function scope if we have the requested variable
      const fVal = this.currentFunctionScope()[identifier];
      if (fVal) {
        return fVal;
      }
    }

    const val = this.memory[identifier];
    if (val === undefined) {
      throw new Error('XP1000: Variable "' + identifier + '" is undeclared');
    } else {
      return val;
    }
  }
  public declareMemoryValue(identifier: string, value: XpellaRuntimeVariable): void {
    // Cannot redeclare a value
    if (this.existsInMemory(identifier)) {
      throw new Error('XP1001: Variable "' + identifier + '" is already declared');
    } else {
      this.memory[identifier] = value;
    }
  }
  public assignMemoryValue(identifier: string, value: XpellaRuntimeVariable): void {
    if (identifier === 'this') {
      // We MUST have an object scope in order to provide "this" a value
      if (!this.currentlyObjectScoped()) {
        throw new Error('XP1002: "this" is unavailable in this scope');
      } else {
        // Try to assign the value to "this"
        identifier = this.currentObjectScope();
      }
    }
    // Cannot assign an undeclared variable
    if (!this.existsInMemory(identifier)) {
      throw new Error('XP1003: Variable "' + identifier + '" is undeclared');
    } else {
      this.memory[identifier].getType().assignFrom(this.memory[identifier], value);
    }
  }
  public existsInMemory(identifier: string): boolean {
    return this.memory[identifier] !== undefined;
  }
}
