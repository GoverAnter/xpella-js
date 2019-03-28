import { XpellaInputStream } from './Helpers/XpellaInputStream';
import { XpellaLexer } from './Helpers/XpellaLexer';
import { XpellaASTProgram } from '../AST/XpellaASTProgram';
import { XpellaParserWarning } from './XpellaParserWarning';
import { XpellaParserOptions } from './XpellaParserOptions';
import { XpellaParserTypeHeader } from './Header/XpellaParserTypeHeader';
import { XpellaLanguageTypeHeaders } from './Definitions/XpellaLanguageTypeHeaders';
import { Logger } from '../Logger';
import { XpellaParserVariableHeader } from './Header/XpellaParserVariableHeader';
import { XpellaASTFunctionDeclaration } from '../AST/XpellaASTFunctionDeclaration';
import { XpellaASTVariableDeclaration } from '../AST/XpellaASTVariableDeclaration';
import { XpellaASTTypeDeclaration } from '../AST/XpellaASTTypeDeclaration';

// Exception codes:
// Current file: XP03xx
// Last exception: XP0303
export abstract class XpellaAbstractParser {
  // Parser input
  protected initialInput: string;
  protected options: XpellaParserOptions;

  // Parser helpers
  protected inputStream: XpellaInputStream;
  protected lexer: XpellaLexer;

  protected readonly defaultTypes: XpellaParserTypeHeader[] = XpellaLanguageTypeHeaders;

  protected readonly logger: Logger = new Logger();

  protected completeScope: { [name: string]: any } = {};
  protected scopeHierarchy: Array<{ [name: string]: any }> = [{}];

  protected currentThis: XpellaASTTypeDeclaration;

  // Parser output
  protected warnings: XpellaParserWarning[] = [];
  protected ast: XpellaASTProgram;
  protected declaredTypes: XpellaParserTypeHeader[] = [];

  constructor(code: string, options: XpellaParserOptions) {
    this.initialInput = code;
    this.options = options;
    this.logger.setLogLevel(options.getLogLevel());

    this.inputStream = new XpellaInputStream(code, options);
    this.lexer = new XpellaLexer(this.inputStream, options);

    this.ast = new XpellaASTProgram([]);
  }

  public getWarnings(): XpellaParserWarning[] { return this.warnings; }
  public getAST(): XpellaASTProgram { return this.ast; }

  protected addWarning(message: string, line: number, column: number): void {
    this.warnings.push(new XpellaParserWarning(message, line, column));
    // NOTE This console call is hardcoded
    console.warn(message + ' (line ' + line + ', col ' + column + ')');
  }

  protected getLanguageType(identifier: string): XpellaParserTypeHeader {
    return this.defaultTypes.find((type) => type.identifier === identifier);
  }
  protected getDeclaredType(identifier: string): XpellaParserTypeHeader {
    return this.declaredTypes.find((type) => type.identifier === identifier);
  }

  protected getMemberInType(type: string, member: string): XpellaParserVariableHeader {
    const t = this.getType(type);
    const memberHeader = t.members.find((mem) => mem.identifier === member);
    if (!memberHeader) {
      this.inputStream.throw('XP0303: Cannot find member "' + member + '" in type "' + type + '"');
    }
    return memberHeader;
  }

  protected getType(identifier: string): XpellaParserTypeHeader {
    if (identifier === this.currentThis.identifier) {
      return XpellaParserTypeHeader.fromDeclaration(this.currentThis);
    }
    let type = this.getLanguageType(identifier);
    if (type) {
      return type;
    } else {
      type = this.getDeclaredType(identifier);
      if (type) {
        return type;
      }
    }
    this.inputStream.throw('XP0300: Cannot find type "' + identifier + '"');
  }

  protected typeExists(identifier: string): boolean {
    if (this.getLanguageType(identifier) || this.getDeclaredType(identifier)) {
      return true;
    } else {
      return false;
    }
  }

  protected pushScope(): void {
    this.scopeHierarchy.push({});
  }
  protected popScope(): void {
    const scope = this.scopeHierarchy.pop();
    // Remove all vars in this scope from the complete scope
    for (const variable in scope) {
      if (scope.hasOwnProperty(variable)) {
        delete this.completeScope[variable];
      }
    }
  }
  protected variableExists(identifier: string): boolean {
    return !!this.completeScope[identifier];
  }
  protected getVariable(identifier: string): XpellaParserVariableHeader {
    if (!this.variableExists(identifier)) {
      this.inputStream.throw('XP0301: Variable "' + identifier + '" is undeclared');
    }
    return this.completeScope[identifier];
  }
  protected createVariable(variable: XpellaParserVariableHeader): void {
    if (this.variableExists(variable.identifier)) {
      this.inputStream.throw('XP0302: Variable "' + variable.identifier + '" is already declared');
    }
    this.scopeHierarchy[this.scopeHierarchy.length - 1][variable.identifier] = variable;
    this.completeScope[variable.identifier] = variable;
  }

  protected compareArgsArrays(arr1: Array<{ type: string, hasDefault: boolean }>, arr2: string[]): boolean {
    for (let i = 0; i < arr1.length; i++) {
      if (i === arr2.length) {
        // Check if remaining params are default
        if (i < arr1.length - 1 && !arr1[i + 1].hasDefault) {
          return false;
        }
        return true; // Because remaining params have default
      } else {
        if (arr1[i].type !== arr2[i]) {
          return false;
        }
      }
    }

    return true;
  }

  /** Small helper method to compare the content of two arrays */
  protected arrayEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }
}
