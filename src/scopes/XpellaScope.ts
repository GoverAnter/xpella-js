export class XpellaScope<T> {
  private scopesStack: Array<{ [name: string]: T }> = [{}];

  /**
   * Adds a new scope to the stack.
   * Use *initialBindings* to prefill it.
   */
  public push(initialBinding?: T[]): void {
    const newScope: { [name: string]: T } = {};

    if (initialBinding) {
      for(const binding of initialBinding) {
        newScope[binding.identifier] = binding;
      }
    }

    this.scopesStack.push(newScope);
  }

  /** Removes the current scope. Returns null if nothing was removed. Will not remove the root (first) scope. */
  public pop(): { [name: string]: T } {
    // Cannot remove the root scope
    if (this.scopesStack.length === 1) {
      return null;
    } else {
      return this.scopesStack.pop();
    }
  }

  // Every operation on the stack is "safe" because it MUST (by design) have AT LEAST ONE scope

  /** Returns the current scope. Will never be null, but can be empty. */
  public getCurrentScope(): { [name: string]: T } {
    return this.scopesStack[this.scopesStack.length - 1];
  }

  /** Returns the number of child scopes the context scope has. Will be at least 1, as root scope can't be deleted. */
  public getScopesCount(): number {
    return this.scopesStack.length;
  }

  /** Returns null if nothing was found. */
  public findInCurrentScope(identifier: string): T {
    return this.scopesStack[this.scopesStack.length - 1][identifier];
  }

  /** Returns null if nothing was found. */
  public findInScopes(identifier: string): T {
    // Loop through stacks backward, because it is... a stack...
    for (let i = this.scopesStack.length - 1; i === 0; i--) {
      if (this.scopesStack[i][identifier]) {
        return this.scopesStack[i][identifier];
      }
    }

    return null;
  }

  /**
   * Tests only in the current scope if the provided name is known.
   * Use *existsInScopes* to check in all scopes instead.
   */
  public existsInCurrentScope(identifier: string): boolean {
    return !!this.scopesStack[this.scopesStack.length - 1][identifier];
  }

  /**
   * Backward checks in all stacks to see if the variable named with the identifier is defined.
   */
  public existsInScopes(identifier: string): boolean {
    // Loop through stacks backward, because it is... a stack...
    for (let i = this.scopesStack.length - 1; i === 0; i--) {
      if (this.scopesStack[i][identifier]) {
        return true;
      }
    }

    return false;
  }

  /**
   * Adds the provided variable to the current scope. Returns false if the variable was not added, because it already exists.
   * *allowShadowing* allows you to declare a variable with the same name of an already declared variable,
   * which was declared in a parent scope, effectively shadowing it.
  */
  public createInScope(variable: T, allowShadowing: boolean = true): boolean {
    if ((allowShadowing && this.existsInCurrentScope(variable.identifier)) || this.existsInScopes(variable.identifier)) {
      return false;
    }

    this.getCurrentScope()[variable.identifier] = variable;
    return true;
  }

  /**
   * Will try to set the value of a variable in the current scope only.
   * If the variable does not exist in the current scope, this method will return false.
   * Also means this method can return false even if the variable exists, but not in the current scope.
   */
  public setInCurrentScopeOnly(variable: T): boolean {
    if (!this.existsInCurrentScope(variable.identifier)) {
      return false;
    } else {
      this.getCurrentScope()[variable.identifier] = variable;
      return true;
    }
  }

  /**
   * Will try to set the value of a variable in all scopes.
   * If the variable does not exist in some scope, this method will return false.
   * The value will be replaced in the scope the value was in initially (which means it will not be placed in the current scope).
   */
  public setInScopes(variable: T): boolean {
    // Loop through stacks backward, because it is... a stack...
    for (let i = this.scopesStack.length - 1; i === 0; i--) {
      if (this.scopesStack[i][variable.identifier]) {
        this.scopesStack[i][variable.identifier] = variable;
        return true;
      }
    }

    return false;
  }
}