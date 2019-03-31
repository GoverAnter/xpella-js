import { XpellaParserOptions } from './XpellaParserOptions';
import { XpellaASTStatement } from '../AST/XpellaASTStatement';
import { XpellaASTCondition } from '../AST/XpellaASTCondition';
import { XpellaASTBlock } from '../AST/XpellaASTBlock';
import { XpellaAbstractExpressionParser } from './XpellaAbstractExpressionParser';
import {
  XpellaParserLineDelimiter,
  XpellaParserThisKeyword,
  XpellaParserTypeDeclarationKeyword,
  XpellaParserConstructs,
  XpellaParserModifiers,
  XpellaParserVisibilities,
  XpellaParserStatementKeywords,
  XpellaParserExpressionKeywords,
  XpellaParserObjectAccessor
} from './Definitions/XpellaKeywords';
import { XpellaASTExpressionOperator } from '../AST/XpellaASTExpressionOperator';
import { XpellaASTVariable } from '../AST/XpellaASTVariable';
import { XpellaASTAssignment } from '../AST/XpellaASTAssignment';
import { XpellaASTDeclaration } from '../AST/XpellaASTDeclaration';
import { XpellaASTVariableDeclaration } from '../AST/XpellaASTVariableDeclaration';
import { XpellaParserMemberHeader } from './Header/XpellaParserMemberHeader';
import { XpellaASTLiteral } from '../AST/XpellaASTLiteral';
import { XpellaParserTypeHeader } from './Header/XpellaParserTypeHeader';
import { XpellaParserBookmark } from './Helpers/XpellaParserBookmark';
import { XpellaASTTypeDeclaration } from '../AST/XpellaASTTypeDeclaration';
import { XpellaASTFunctionDeclaration } from '../AST/XpellaASTFunctionDeclaration';
import { XpellaASTReturnStatement } from '../AST/XpellaASTReturnStatement';
import { XpellaASTExpression } from '../AST/XpellaASTExpression';
import { XpellaASTObjectCallMethod } from '../AST/XpellaASTObjectCallMethod';
import { XpellaASTObjectCallMember } from '../AST/XpellaASTObjectCallMember';
import { XpellaASTProgram } from '../AST/XpellaASTProgram';

// Exception codes:
// Current file: XP04xx
// Last exception: XP0421
export class XpellaParser extends XpellaAbstractExpressionParser {
  private currentFunctionExpectedReturnType: string = null;

  constructor(code: string, options: XpellaParserOptions = new XpellaParserOptions()) {
    super(code, options);
  }

  // This is the main parse method
  public executeParse(): XpellaASTProgram {
    const types: XpellaASTTypeDeclaration[] = [];
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    while (!this.inputStream.isEof()) {
      types.push(this.parseType());
      this.lexer.skipWhitespaces(false); // Eat whitespaces
    }

    return new XpellaASTProgram(types);
  }

  public parseType(): XpellaASTTypeDeclaration {
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    this.lexer.eatWord(XpellaParserTypeDeclarationKeyword);
    this.lexer.skipWhitespaces(true); // Eat whitespaces

    const typeName = this.lexer.readWord();

    if (this.typeExists(typeName)) {
      this.inputStream.throw('XP0412: Type "' + typeName + '" is already declared', typeName.length);
    }

    this.lexer.skipWhitespaces(false); // Eat whitespaces
    this.lexer.eatChar('{');
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    this.currentThis = new XpellaASTTypeDeclaration([], '', typeName, [], []);

    // Find all declarations in this type
    while (this.inputStream.peek() !== '}') {
      // Read every word we find
      let wasEmpty: boolean = false;
      const positions: XpellaParserBookmark[] = [];
      const words: string[] = [];

      do {
        positions.push(XpellaParserBookmark.fromInputStream(this.inputStream));
        const currentWord = this.lexer.readWord();
        if (!currentWord) {
          wasEmpty = true;
        } else {
          words.push(currentWord);
        }
        this.lexer.skipWhitespaces(false); // Eat whitespaces
      } while (!wasEmpty);

      // words must be at least 2 long
      if (words.length === 0) {
        this.inputStream.throw('XP0413: Expected type, got "' + this.inputStream.peek() + '"');
      } else if (words.length === 1) {
        this.inputStream.throw('XP0414: Expected identifier, got "' + this.inputStream.peek() + '"');
      }

      let name: string;
      let type: string;
      let visibility: string;
      const modifiers: string[] = [];
      for (let i = 0; i < words.length; i++) {
        if (i === words.length - 1) {
          // This is our identifier
          this.checkReserved(words[i], positions[i].line, positions[i].column);
          if (this.currentThis.methods.some((meth) => meth.identifier === words[i])) {
            this.inputStream.rewind(positions[i].position);
            this.inputStream.throw('XP0415: "' + words[i] + '" is already declared as a method of this class');
          }
          if (this.currentThis.members.some((mem) => mem.identifier === words[i])) {
            this.inputStream.rewind(positions[i].position);
            this.inputStream.throw('XP0416: "' + words[i] + '" is already declared as a member of this class');
          }
          name = words[i];
        } else if (i === words.length - 2) {
          // This is our type
          if (!this.typeExists(words[i]) && words[i] !== 'void') {
            this.inputStream.rewind(positions[i].position);
            this.inputStream.throw('XP0417: Type "' + words[i] + '" does not exists');
          }
          type = words[i];
        } else {
          // This is a modifier (either visibility or not)
          if (XpellaParserVisibilities.some((val) => val === words[i])) {
            // This is a visibility keyword, throw if we already have one
            if (visibility) {
              this.inputStream.rewind(positions[i].position);
              this.inputStream.throw('XP0418: Having more than one visibility modifier is forbidden');
            }
            visibility = words[i];
          } else {
            // Should be a modifier
            if (!XpellaParserModifiers.some((val) => val === words[i])) {
              this.inputStream.rewind(positions[i].position);
              this.inputStream.throw('XP0419: "' + words[i] + '" is not a valid modifier');
            }
            modifiers.push(words[i]);
          }
        }
      }

      if (this.inputStream.peek() === '(') {
        // TODO Handle const methods, to prevent side-effects compile-time
        // This is a method declaration
        this.currentFunctionExpectedReturnType = type;
        const args = this.parseSimpleVariableDeclarationList(typeName);
        this.pushScope();
        args.map((arg) => XpellaParserMemberHeader.fromDeclaration(arg)).forEach((arg) => this.createVariable(arg));

        this.currentThis.methods.push(new XpellaASTFunctionDeclaration([], '', name, visibility, modifiers, type,
                                                                       args, this.parseBlock() as XpellaASTBlock));
        this.popScope();
        this.currentFunctionExpectedReturnType = null; // Just in case...
      } else {
        // This is a member declaration
        let initialAssignation = null;
        if (this.inputStream.peek() === '=') {
          this.lexer.eatChar('=');
          initialAssignation = this.parseExpression();
        }

        this.currentThis.members.push(new XpellaASTVariableDeclaration
          ([], '', name, type, visibility, modifiers, initialAssignation));

        this.lexer.skipWhitespaces(false); // Eat whitespaces
        this.lexer.eatChar(XpellaParserLineDelimiter);
      }

      this.lexer.skipWhitespaces(false); // Eat whitespaces
    }

    this.lexer.eatChar('}');

    const typeDeclaration = this.currentThis;
    this.currentThis = null; // Set it just in case
    this.declaredTypes.push(XpellaParserTypeHeader.fromDeclaration(typeDeclaration));
    return typeDeclaration;
  }

  public parseSimpleVariableDeclarationList(currentType: string): XpellaASTVariableDeclaration[] {
    this.lexer.skipWhitespaces(false); // Eat whitespaces
    this.lexer.eatChar('(');
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    const list: XpellaASTVariableDeclaration[] = [];

    while (this.inputStream.peek() !== ')') {
      // We need exactly 2 words : a type and a name
      const type = this.lexer.readWord();

      if (!type) {
        this.inputStream.throw('XP041A: Unexpected "' + this.inputStream.peek() + '"');
      } else if (!this.typeExists(type) && type !== currentType) {
        this.inputStream.throw('XP041B: Type "' + type + '" does not exists', type.length);
      }

      this.lexer.skipWhitespaces(false); // Eat whitespaces
      const name = this.lexer.readWord();

      if (!name) {
        this.inputStream.throw('XP041C: Unexpected "' + this.inputStream.peek() + '"');
      }
      // NOTE Theorically this shouldn't happen, because scope is masked by function's one
      // } else if (this.variableExists(name)) {
      //   this.inputStream.throw('XP041D: Variable "' + name + '" is already declared in this scope', name.length);
      // }

      this.lexer.skipWhitespaces(false); // Eat whitespaces

      let initialAssignation = null;
      if (this.inputStream.peek() === '=') {
        // User wants to have a default value
        this.lexer.eatChar('=');
        initialAssignation = this.parseExpression();
        this.lexer.skipWhitespaces(false); // Eat whitespaces
      }

      // Can't have a non default parameter after a default one
      if (!initialAssignation && list.length && list[list.length - 1].initialAssignation) {
        this.inputStream.throw('XP0421: Cannot have a non default parameter after a default one');
      }

      list.push(new XpellaASTVariableDeclaration([], '', name, type, 'public', [], initialAssignation));

      if (this.inputStream.peek() === ',') {
        this.lexer.eatChar(',');
      }

      this.lexer.skipWhitespaces(false); // Eat whitespaces
    }

    this.lexer.skipWhitespaces(false); // Eat whitespaces
    this.lexer.eatChar(')');

    return list;
  }

  public parseStatement(): XpellaASTStatement {
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    const initialPosition = this.inputStream.getCurrentPosition();
    const currentWord = this.lexer.readWord();
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    // TODO Add remaining constructs
    if (currentWord === 'if') {
      // Rewind and parse the condition
      this.inputStream.rewind(initialPosition);
      return this.parseCondition();
    } else if (currentWord === 'continue' || currentWord === 'break') {
      // TODO Check if we are in a loop
      this.lexer.skipWhitespaces(false); // Eat whitespaces
      this.lexer.eatChar(XpellaParserLineDelimiter);
    } else if (currentWord === 'return') {
      let expression: XpellaASTExpression = null;
      if (this.currentFunctionExpectedReturnType !== 'void') {
        const expressionPosition = this.inputStream.getCurrentPosition();
        expression = this.parseExpression();
        // TODO Check if type is assignable from
        if (expression.resolvedType !== this.currentFunctionExpectedReturnType) {
          this.inputStream.rewind(expressionPosition);
          this.inputStream.throw('XP041E: Expected type "' + this.currentFunctionExpectedReturnType
            + '" (from method return type), got "' + expression.resolvedType + '"');
        }
      }
      this.lexer.skipWhitespaces(false); // Eat whitespaces
      this.lexer.eatChar(XpellaParserLineDelimiter);
      return new XpellaASTReturnStatement([], '', expression);
    } else if (!currentWord) {
      if (this.inputStream.peek() === '{') {
        // No need to rewind as we didn't advanced the stream
        return this.parseBlock();
      } else if (this.inputStream.peek() === XpellaParserLineDelimiter) {
        // Just a ";" with no expression, eat it and return "no statement"
        this.inputStream.next();
        return null;
      }
    } else {
      this.inputStream.rewind(initialPosition);
      return this.parseExpressionStatement();
    }

    return null;

    // Just in case
    // this.inputStream.throw('XP0400: Expected statement, got "' + this.inputStream.peek() + '"');
  }

  // Not required to be a simple expression, can also be a variable declaration and/or assignation
  public parseExpressionStatement(): XpellaASTStatement {
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    const initialPosition = this.inputStream.getCurrentPosition();
    const firstWord = this.lexer.readWord();
    this.lexer.skipWhitespaces(false); // Eat whitespaces
    // We have a word, but it does not corresponds to a language keyword, so it can be
    // 1. a variable declaration : [type] [identifier] ([operator] [expression]);
    // 2. an assignation : [identifier] [operator] [expression];
    // 3. a plain expression : [expression];

    // Try to read a second word, then try to read an operator
    const ipos = XpellaParserBookmark.fromInputStream(this.inputStream);
    const possibleIdentifier = this.lexer.readWord();

    this.lexer.skipWhitespaces(false); // Eat whitespaces
    let operatorPosition = this.inputStream.getCurrentPosition();
    let possibleOperator = this.lexer.readOperator();

    this.lexer.skipWhitespaces(false); // Eat whitespaces

    let statement: XpellaASTStatement;

    let preresolvedLHS: XpellaASTExpression = null;

    if (this.inputStream.peek() === XpellaParserObjectAccessor && !possibleIdentifier) {
      // Well, we face an object call at first, resolve it
      this.inputStream.rewind(initialPosition);
      const callee = this.resolveVariableOrLiteral();
      preresolvedLHS = this.maybeObjectCall(callee);

      // Then find out if we have a statement operator
      this.lexer.skipWhitespaces(false); // Eat whitespaces
      operatorPosition = this.inputStream.getCurrentPosition();
      possibleOperator = this.lexer.readOperator();
    }

    const hasOperator: boolean = !!(possibleOperator && this.lexer.isStatementOperator(possibleOperator));
    const hasIdentifier: boolean = !!possibleIdentifier;
    const isDeclaration: boolean = hasIdentifier
      && (hasOperator || this.inputStream.peek() === XpellaParserLineDelimiter);

    if (hasOperator && preresolvedLHS instanceof XpellaASTObjectCallMethod) {
      this.inputStream.throw('XP041F: Cannot assign a value to a method return', possibleOperator.length);
    }

    if (!isDeclaration && !hasOperator) {
      // This must be a plain expression
      this.inputStream.rewind(initialPosition);
      if (preresolvedLHS) {
        statement = this.solveExpression(preresolvedLHS);
      } else {
        statement = this.parseExpression();
      }
    } else if (isDeclaration) {
      // This is a declaration (with or without assignment)
      // No need to check for a pre resolved call, this can't happen

      // Try to get type, this throws if it does not exists, so it also acts like a check
      const type = this.getType(firstWord);

      // Check identifier in case it is a reserved keyword
      this.checkReserved(possibleIdentifier, ipos.line, ipos.column);

      // Check if variable exists
      if (this.variableExists(possibleIdentifier)) {
        this.inputStream.rewind(ipos.position);
        this.inputStream.throw('XP0401: Variable "' + possibleIdentifier + '" is already declared in this scope');
      }

      let expression = null;
      if (hasOperator) {
        // This is when we have a declaration with an assignment

        // Only assign operator is accepted on declaration
        if (possibleOperator !== '=') {
          this.inputStream.rewind(operatorPosition);
          this.inputStream.throw('XP0402: Cannot use a complex assigment on a variable declaration, '
            + 'only simple assignment operator "=" is accepted');
        }

        // Parse the assignment expression
        const expressionPosition = this.inputStream.getCurrentPosition();
        expression = this.parseExpression();

        // Type check time !! If types are the same, no need to check
        if (expression.resolvedType !== firstWord
            && (!type.operators['='] || !type.operators['='][expression.resolvedType])) {
          this.inputStream.rewind(expressionPosition);
          this.inputStream.throw('XP0403: Cannot assign expression of type "' + expression.resolvedType
            + '" to variable of type "' + firstWord + '"');
        }
      }

      // TODO Modifiers
      statement = new XpellaASTVariableDeclaration([], '', possibleIdentifier, firstWord, 'public', [], expression);
      this.createVariable(new XpellaParserMemberHeader(possibleIdentifier, firstWord, 'public', []));
    } else {
      // We have a variable assignation
      let type;
      let identifier;
      let isConst = false;
      if (preresolvedLHS) {
        const typedPreresolvedLHS = preresolvedLHS as XpellaASTObjectCallMember;
        type = typedPreresolvedLHS.resolvedType;
        isConst = this.getMemberInType(typedPreresolvedLHS.object.resolvedType,
                                       typedPreresolvedLHS.member.identifier)
                                         .modifiers.some((id) => id === 'const');
      } else {
        const variable = this.getVariable(firstWord);
        isConst = variable.modifiers.some((id) => id === 'const');
        type = variable.type;
        identifier = identifier;
      }

      if (isConst) {
        this.inputStream.throw('XP0420: Cannot assign a value to a const variable');
      }

      const variableType = this.getType(type);
      let baseOperator: string;
      // Verify that assignation operator is supported
      if (possibleOperator.length > 1) { // Complex operator, need to check, otherwise it is a simple assignation
        baseOperator = possibleOperator.slice(0, possibleOperator.length - 1);
        if (!variableType.operators[baseOperator]) {
          this.inputStream.rewind(operatorPosition);
          this.inputStream.throw('XP0404: Cannot use  assignment operator "' + possibleOperator
            + '" on type "' + type + '" : base operator "' + baseOperator + '" is not defined on type');
        }
      }

      // Parse the assignment expression
      const expressionPosition = this.inputStream.getCurrentPosition();
      let assignmentExpression = this.parseExpression();

      // If this is a complex operator, left hand must support the operation with the right hand type
      if (baseOperator) {
        if (!variableType.operators[baseOperator][assignmentExpression.resolvedType]) {
          this.inputStream.rewind(operatorPosition);
          this.inputStream.throw('XP0405: Operator "' + baseOperator + '" from type "' + type
            + '" cannot accept type "' + assignmentExpression.resolvedType + '"');
        } else {
          // Add the operator to the expression
          assignmentExpression = new XpellaASTExpressionOperator(
            [], '',
            type,
            baseOperator,
            preresolvedLHS ? preresolvedLHS : new XpellaASTVariable([], '', type, identifier),
            assignmentExpression);
        }
      }

      // Check assignment type, if types are the same, no need to check
      if (assignmentExpression.resolvedType !== type
          && (!variableType.operators['='] || !variableType.operators['='][assignmentExpression.resolvedType])) {
        this.inputStream.rewind(expressionPosition);
        this.inputStream.throw('XP0406: Cannot assign expression of type "' + assignmentExpression.resolvedType
          + '" to variable of type "' + type + '"');
      }

      statement = new XpellaASTAssignment(
        [], '',
        preresolvedLHS ? preresolvedLHS as XpellaASTObjectCallMember : new XpellaASTVariable([], '', type, identifier),
        assignmentExpression);
    }

    this.lexer.skipWhitespaces(false); // Eat whitespaces
    this.lexer.eatChar(XpellaParserLineDelimiter);

    return statement;
  }

  public parseCondition(): XpellaASTStatement {
    // If/else
    this.lexer.skipWhitespaces(false);
    // Eat if keyword
    this.lexer.eatWord('if');

    this.lexer.skipWhitespaces(false); // Eat whitespaces
    this.lexer.eatChar('(');
    this.lexer.skipWhitespaces(false); // Eat whitespaces
    const expressionPosition = this.inputStream.getCurrentPosition();
    if (this.inputStream.peek() === ')') {
      this.inputStream.throw('XP0407: Expected condition expression');
    }
    // Parse expression in parenthesis
    const condition = this.parseExpression();
    if (condition.resolvedType !== 'boolean') {
      this.inputStream.rewind(expressionPosition);
      this.inputStream.throw('XP0408: Expected expression to resolve to a boolean');
    }
    this.lexer.skipWhitespaces(false); // Eat whitespaces
    this.lexer.eatChar(')');
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    const passConditionBookmark = XpellaParserBookmark.fromInputStream(this.inputStream);
    this.pushScope();
    const passConditionExecution = this.optimizeScopedStatement(this.parseStatement(), passConditionBookmark);
    this.popScope();

    let failConditionExecution = null;

    this.lexer.skipWhitespaces(false); // Eat whitespaces
    // Maybe we have a else after
    const currentPosition = this.inputStream.getCurrentPosition(); // To rewind in case there is no else
    const nextWord = this.lexer.readWord();
    if (nextWord === 'else') {
      // We have a else
      this.lexer.skipWhitespaces(false); // Eat whitespaces
      const failConditionBookmark = XpellaParserBookmark.fromInputStream(this.inputStream);
      this.pushScope();
      failConditionExecution = this.optimizeScopedStatement(this.parseStatement(), failConditionBookmark);
      this.popScope();
    } else {
      this.inputStream.rewind(currentPosition);
    }

    // Don't return a block if we have nothing to execute
    if (passConditionExecution === null && failConditionExecution === null) {
      return null;
    } else if (!condition && failConditionExecution === null) {
      return null;
    } else if (condition instanceof XpellaASTLiteral) {
      const literalCondition = condition as XpellaASTLiteral;
      if (literalCondition.resolvedType === 'boolean') {
        if (literalCondition.value) {
          return passConditionExecution;
        } else {
          return failConditionExecution;
        }
      }
    } else if (passConditionExecution && passConditionExecution.equals(failConditionExecution)) {
      return passConditionExecution;
    }

    return new XpellaASTCondition([], '', condition, passConditionExecution, failConditionExecution);
  }

  public parseBlock(): XpellaASTStatement {
    // Eat whitespaces
    this.lexer.skipWhitespaces(false);
    // Expect a bracket
    this.lexer.eatChar('{');

    const statements: XpellaASTStatement[] = [];

    // TODO If block is in a if (or a construct) scope is already pushed, no need to do it again
    this.pushScope();

    while (this.inputStream.peek() !== '}') {
      const statement = this.parseStatement();
      if (statement) {
        statements.push(statement);
      }

      // Eat whitespaces
      this.lexer.skipWhitespaces(false);
    }

    this.lexer.eatChar('}');

    this.popScope();

    if (statements.length === 0) {
      return null;
    } else if (statements.length === 1) {
      return statements[0];
    }

    return new XpellaASTBlock([], '', statements);
  }

  public optimizeScopedStatement(statement: XpellaASTStatement, bookmark: XpellaParserBookmark): XpellaASTStatement {
    if (statement instanceof XpellaASTDeclaration) {
      this.addWarning('XP0409: Useless declaration in single statement block', bookmark.line, bookmark.column);
      return null;
    } else {
      return statement;
    }
  }

  /**
   * Tests if an identifier does not conflict with language constructs. DOES NOT TEST IF IDENTIFIER IS ALREADY TAKEN.
   * Throws an error if identifier is reserved.
   * @param identifier The identifier to test
   */
  public checkReserved(identifier: string, line: number, column: number): void {
    if (identifier === XpellaParserThisKeyword) {
      this.inputStream.throw('XP040A: "' + identifier + '" is a reserved keyword', identifier.length);
    } else if (this.defaultTypes.some((type: XpellaParserTypeHeader) => type.identifier === identifier)
      || this.declaredTypes.some((type: XpellaParserTypeHeader) => type.identifier === identifier)) {
      this.inputStream.throw('XP040B: "' + identifier + '" is a declared type, name conflicts with type object',
                             identifier.length);
    } else if (XpellaParserStatementKeywords.some((keyword: string) => keyword === identifier)) {
      this.inputStream.throw('XP040C: "' + identifier + '" is a reserved statement keyword', identifier.length);
    } else if (XpellaParserExpressionKeywords.some((keyword: string) => keyword === identifier)) {
      this.inputStream.throw('XP040D: "' + identifier + '" is a reserved expression keyword', identifier.length);
    } else if (this.options.shouldOutputWarnings()) {
      // Don't even check for warnings if we don't need to output them
      if (identifier === XpellaParserTypeDeclarationKeyword) {
        this.addWarning('XP040E: "' + identifier
          + '": Identifier could be confused with the eponym type declaration keyword',
                        line, column);
      } else if (XpellaParserVisibilities.indexOf(identifier) !== -1) {
        this.addWarning('XP040F: "' + identifier + '": Identifier could be confused with the eponym visibility keyword',
                        line, column);
      } else if (XpellaParserModifiers.indexOf(identifier) !== -1) {
        this.addWarning('XP0410: "' + identifier + '": Identifier could be confused with the eponym modifier keyword',
                        line, column);
      } else if (XpellaParserConstructs.indexOf(identifier) !== -1) {
        this.addWarning('XP0411: "' + identifier + '": Identifier could be confused with the eponym construct keyword',
                        line, column);
      }
    }
  }
}
