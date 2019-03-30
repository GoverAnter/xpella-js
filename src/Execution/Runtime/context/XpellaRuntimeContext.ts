import { XpellaContextScope } from "./XpellaContextScope";
import { RuntimeTypes } from "../../XpellaExecutor";
import { XpellaRuntimeVariable } from "../XpellaRuntimeVariable";

// Exception codes:
// Current file: XP10xx
// Last exception: XP1005
export class XpellaRuntimeContext {
  private memory: XpellaContextScope[] = [];

  public types: RuntimeTypes;

  public getCurrentScope(): XpellaContextScope {
    if (this.memory.length === 0) {
      throw new Error("XP1000: No scopes defined in this context");
    }
    return this.memory[this.memory.length - 1];
  }

  // TODO Allow shadowing option on scope creation
  /**
   * Creates a scope that will mask the current one, ie. vars from the current scope wont be accessible in the new one.
   * Use this if you want to create a clean scope, like for a function call.
   * Use *initialBindings* to put elements in its root scope.
   */
  public createMaskingScope(initialBindings?: XpellaRuntimeVariable[]): void {
    const newScope = new XpellaContextScope();

    if (initialBindings) {
      for (const binding of initialBindings) {
        // No need to check for errors, as the scope is clean, and nothing can be shadowed
        newScope.createInScope(binding);
      }
    }
    
    this.memory.push(newScope);
  }

  /**
   * Use this if you want the variables of the current scope to be available in this one.
   * This will allow variable masking, as it will not exist in the new one (only on parent scopes).
   * Use *initialBindings* to prefill it.
   */
  public createChildScope(initialBindings?: XpellaRuntimeVariable[]): void {
    const currentScope = this.getCurrentScope();
    // No need to check for errors, as the scope is clean, and we allow shadowing by default
    currentScope.push(initialBindings);
  }

  /** Removes the current masking scope. */
  public removeMaskingScope(): void {
    if (this.memory.length === 0) {
      throw new Error('XP1004: No masking scope to remove');
    } else {
      this.memory.pop();
    }
  }

  public removeChildScope(): void {
    if (!this.getCurrentScope().pop()) {
      throw new Error('XP1005: Cannot remove a masking scope\'s root child scope, remove the masking scope instead');
    }
  }

  public getMemoryValue(identifier: string): XpellaRuntimeVariable {
    const val = this.getCurrentScope().findInScopes(identifier);
    if (!val) {
      throw new Error('XP1001: Variable "' + identifier + '" is undeclared in the current scope');
    } else {
      return val;
    }
  }
  // TODO Shadowing options
  /** Use this to create a new variable un memory. */
  public declareMemoryValue(variable: XpellaRuntimeVariable): void {
    if (!this.getCurrentScope().createInScope(variable)) {
      throw new Error('XP1002: Variable "' + variable.identifier + '" is already declared and cannot be shadowed');
    }
  }
  /** Use this method to assign a value to an already declared variable. */
  public assignMemoryValue(variable: XpellaRuntimeVariable): void {
    // Cannot assign an undeclared variable
    if (!this.getCurrentScope().setInScopes(variable)) {
      throw new Error('XP1003: Variable "' + variable.identifier + '" is undeclared');
    }
  }
  public exists(identifier: string): boolean {
    return this.getCurrentScope().existsInScopes(identifier);
  }
}
