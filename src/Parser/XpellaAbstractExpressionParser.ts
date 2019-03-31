import { XpellaAbstractVariableParser } from './XpellaAbstractVariableParser';
import { XpellaASTExpression } from '../AST/XpellaASTExpression';
import { XpellaASTBackOperator } from '../AST/XpellaASTBackOperator';
import { XpellaASTObjectCallMember } from '../AST/XpellaASTObjectCallMember';
import { XpellaASTObjectCallMethod } from '../AST/XpellaASTObjectCallMethod';
import { XpellaASTVariable } from '../AST/XpellaASTVariable';
import { XpellaASTFunctionCall } from '../AST/XpellaASTFunctionCall';
import { XpellaParserObjectAccessor,
         XpellaParserStringDelimiters,
         XpellaParserExpressionOperators,
         XpellaParserStatementOperators,
         XpellaParserTypeInstantiationKeyword} from './Definitions/XpellaKeywords';
import { XpellaASTObjectCall } from '../AST/XpellaASTObjectCall';
import { XpellaASTFrontOperator } from '../AST/XpellaASTFrontOperator';
import { XpellaASTExpressionOperator } from '../AST/XpellaASTExpressionOperator';
import { XpellaParserMemberHeader } from './Header/XpellaParserMemberHeader';
import { XpellaParserTypeHeader } from './Header/XpellaParserTypeHeader';
import { XpellaParserFunctionHeader } from './Header/XpellaParserFunctionHeader';
import { XpellaASTStaticType } from '../AST/XpellaASTStaticType';

// Exception codes:
// Current file: XP02xx
// Last exception: XP0211
export abstract class XpellaAbstractExpressionParser extends XpellaAbstractVariableParser {
  public parseExpression(precedence: number = 0): XpellaASTExpression {
    return this.solveExpression(this.parseNextExpression(), precedence);
  }

  public parseExpressionList(openChar: string = '(', closeChar: string = ')', delimiter: string = ',')
    : XpellaASTExpression[] {
    this.lexer.skipWhitespaces(false); // Eat whitespaces
    this.lexer.eatChar(openChar);
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    const expressions: XpellaASTExpression[] = [];
    let first = true;

    while (this.inputStream.peek() !== closeChar) {
      if (first) {
        first = false;
      } else {
        this.lexer.eatChar(delimiter);
      }
      expressions.push(this.parseExpression());

      this.lexer.skipWhitespaces(false); // Eat whitespaces
    }

    this.lexer.eatChar(closeChar);

    return expressions;
  }

  public solveExpression(lhs: XpellaASTExpression, lastOperatorPrecedence: number = 0): XpellaASTExpression {
    this.lexer.skipWhitespaces(false); // Eat whitespaces
    // Peek operator
    const initialPosition = this.inputStream.getCurrentPosition();
    const operator = this.lexer.readOperator();

    if (operator) {
      // Get precedence
      const precedence = XpellaParserExpressionOperators[operator];
      if (!precedence) {
        let opType = 'unknown operator';
        if (XpellaParserStatementOperators.some((op) => op === operator)) {
          opType = 'statement operator';
        }
        this.inputStream.throw('XP0206: Expected expression operator, got "' + operator + '" ' + opType,
                               operator.length);
      }

      // TODO Resolve literal operations compile time
      if (lastOperatorPrecedence < precedence) {
        // If operator is an equality comparison ("==" or "!=") and it is used to compare to the same type
        // Then we can be sure it is present, because it is provided by the language
        const isEqualityComparison = operator === '==' || operator === '!=';
        const isComparison = isEqualityComparison || operator === '<' || operator === '>'
          || operator === '<=' || operator === '>=';

        const lhsType = this.getType(lhs.resolvedType);
        if (!isEqualityComparison && !lhsType.operators[operator]) {
          this.inputStream.throw('XP0211: Operator "' + operator + '" is not defined in type "'
                                    + lhs.resolvedType + '"',
                                 operator.length);
        }
        const rhsPosition = this.inputStream.getCurrentPosition();
        const rhs = this.parseExpression(precedence);
        if ((!isEqualityComparison || lhsType.identifier !== rhs.resolvedType)
          && !lhsType.operators[operator][rhs.resolvedType]) {
          this.inputStream.rewind(rhsPosition);
          this.inputStream.throw('Operator "' + operator + '" from type "' +
            lhs.resolvedType + '" cannot accept type "' + rhs.resolvedType + '"');
        }
        const solved = this.solveExpression(
          new XpellaASTExpressionOperator([], '', isComparison ? 'boolean' : lhs.resolvedType, operator, lhs, rhs),
          lastOperatorPrecedence);
        return solved;
      } else {
        // As we should peek, rewind
        this.inputStream.rewind(initialPosition);
      }
    }
    return lhs;
  }

  public parseNextExpression(readForBackOperator: boolean = false): XpellaASTExpression {
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    // If this word is a back operator, and back operator is allowed here
    // parse next expression to complete the expression loop
    if (!readForBackOperator) {
      const operator = this.lexer.readOperator();
      if (operator) {
        if (this.lexer.isBackOperator(operator)) {
          const expr = this.parseNextExpression(true) as XpellaASTVariable;
          const exprType = this.getType(expr.resolvedType);
          if (!exprType.operators[operator] || !exprType.operators[operator].back) {
            this.inputStream.throw('XP0207: Type "' + expr.resolvedType +
              '" does not declare a back operator "' + operator + '"');
          }
          return new XpellaASTBackOperator([], '', expr.resolvedType, operator, expr);
        } else {
          this.inputStream.throw('XP0200: Expected expression, got operator instead', operator.length);
        }
      }
    }

    let expression: XpellaASTExpression;

    // Test if this is a string literal, in this case readWord won't help us
    if (XpellaParserStringDelimiters.indexOf(this.inputStream.peek()) !== -1) {
      if (readForBackOperator) {
        this.inputStream.throw('XP0201: Expected variable expression for back operator, got string literal instead');
      } else {
        expression = this.resolveStringLiteral();
      }
    } else if (!isNaN(Number(this.inputStream.peek()))) {
      // This should be a number (either a float or an int) because an identifier can't begin with a number
      expression = this.resolveNumberLiteral();
    } else {
      const initialPosition = this.inputStream.getCurrentPosition();
      const word = this.lexer.readWord();

      if (word) {
        // No need to check for object call, we check that later
        // Check if it is a function call, if not then it is a variable/literal
        this.lexer.skipWhitespaces(false); // Eat whitespaces
        if (this.inputStream.peek() === '(') {
          // Function call
          this.inputStream.rewind(initialPosition);
          expression = this.resolveFunctionCall();
        } else {
          if (word === XpellaParserTypeInstantiationKeyword) {
            // This is an object instantiation, read the type
            this.lexer.skipWhitespaces(false); // Eat whitespaces
            const callPosition = this.inputStream.getCurrentPosition();
            const type = this.lexer.readWord();
            if (!type) {
              this.inputStream.throw('XP0210: Expected type identifier, got "' + this.inputStream.peek() + '"');
            }
            this.inputStream.rewind(callPosition);
            expression = this.resolveFunctionCall(this.getType(type), false, true);
          } else {
            this.inputStream.rewind(initialPosition);
            expression = this.resolveVariableOrLiteral();
          }
        }
      } else {
        if (this.inputStream.peek() === '.') {
          // Maybe it is a float, in the form '.12'
          expression = this.resolveNumberLiteral();
        } else {
          // Dunno, so throw
          this.inputStream.throw('XP0203: Expected expression, got "' + this.inputStream.peek() + '"');
        }
      }
    }

    if (!expression) {
      this.inputStream.throw('XP0202: Expected expression');
    } else {
      // If needed, check for front operator
      if (!readForBackOperator && expression instanceof XpellaASTVariable) {
        const frontOperator = this.maybeFrontOperator(expression);
        if (frontOperator) {
          return frontOperator;
        }
      }
      // Check for object call right behind this expression
      if (!readForBackOperator) {
        const objectCall = this.maybeObjectCall(expression);
        if (objectCall) {
          return objectCall;
        }
      }
      return expression;
    }
  }

  // If there is a front operator, returns a fully constructed object, else return null
  // Does not throw in any case
  protected maybeFrontOperator(expression: XpellaASTVariable): XpellaASTFrontOperator {
    this.lexer.skipWhitespaces(false); // Eat whitespaces

    const operatorPosition = this.inputStream.getCurrentPosition();
    const operator = this.lexer.readOperator();
    if (operator && this.lexer.isFrontOperator(operator)) {
      const exprType = this.getType(expression.resolvedType);
      if (!exprType.operators[operator] || !exprType.operators[operator].front) {
        this.inputStream.throw('XP0208: Type "' + expression.resolvedType
          + '" does not declare a front operator "' + operator + '"');
      }
      return new XpellaASTFrontOperator([], '', expression.resolvedType, operator, expression);
    }
    // Rewind just in case we moved
    this.inputStream.rewind(operatorPosition);
    return null;
  }

  protected maybeObjectCall(callee: XpellaASTExpression): XpellaASTObjectCall {
    // Don't try to eat space, we don't want any here
    if (this.inputStream.peek() === XpellaParserObjectAccessor) {
      // Hmmm, maybe, eat the accessor
      this.inputStream.next();
      // Don't try to eat space, we don't want any here
      const initialPosition = this.inputStream.getCurrentPosition();

      // Make sure we have something behind
      const word = this.lexer.readWord();
      if (!word) {
        this.inputStream.throw('XP0204: Expected method or member identifier after object accessor');
      }

      // Let's see if it is a method call or a member call
      this.lexer.skipWhitespaces(false); // Eat whitespaces

      let call: XpellaASTObjectCall;
      let calleeType: XpellaParserTypeHeader;
      if (callee.resolvedType === this.currentThis.identifier) {
        calleeType = XpellaParserTypeHeader.fromDeclaration(this.currentThis);
      } else {
        calleeType = this.getType(callee.resolvedType);
      }
      if (this.inputStream.peek() === '(') {
        // Method call
        this.inputStream.rewind(initialPosition);
        call = new XpellaASTObjectCallMethod
          ([], '', callee, this.resolveFunctionCall(calleeType, callee instanceof XpellaASTStaticType));
      } else {
        // Just a member
        const member = calleeType.members.find((mem: XpellaParserMemberHeader) => mem.identifier === word);
        if (!member) {
          this.inputStream.throw('XP0209: Type "' + callee.resolvedType
                                   + '" does not have a member named "' + word + '"',
                                 word.length);
        } else if (callee instanceof XpellaASTStaticType && !member.modifiers.some((mem) => mem === 'static')) {
          this.inputStream.throw('XP020F: Cannot call non static member "' + member.identifier + '" without instance',
                                 word.length);
        }
        call = new XpellaASTObjectCallMember([], '', callee, new XpellaASTVariable([], '', member.type, word));
      }
      // Chain calls
      const maybeCall = this.maybeObjectCall(call);
      return maybeCall ? maybeCall : call;
    } else {
      return null; // Can't be, for sure
    }
  }

  protected resolveFunctionCall(callee: XpellaParserTypeHeader = null, staticCall = false, objectInstantiation = false)
      : XpellaASTFunctionCall {
    this.lexer.skipWhitespaces(false); // Eat whitespaces
    const initialPosition = this.inputStream.getCurrentPosition();
    // Expect function name
    const identifier = this.lexer.readWord();

    if (!identifier) {
      this.inputStream.throw('XP0205: Expected function identifier for function call, got "'
        + this.inputStream.peek() + '"');
    }

    const args = this.parseExpressionList();
    const headerArgs = args.slice().map((arg: XpellaASTExpression) => arg.resolvedType);

    let returnType: string;

    // If callee is null, we're searching a variable, otherwise, we're searching a method in an object
    if (callee === null) {
      const variable = this.getVariable(identifier);
      if (variable instanceof XpellaParserFunctionHeader) {
        // Compare args
        const functionHeader = variable as XpellaParserFunctionHeader;
        if (!this.compareArgsArrays(functionHeader.args, headerArgs)) {
          this.inputStream.rewind(initialPosition);
          this.inputStream.throw('XP020B: Expected arguments [' + functionHeader.args.join(', ')
            + '], got [' + headerArgs.join(', ') + ']');
        } else {
          // This is it !!
          returnType = functionHeader.returnType;
        }
      } else {
        this.inputStream.rewind(initialPosition);
        this.inputStream.throw('XP020A: Tying to call "' + identifier + '" as a function, but is "'
          + (variable as XpellaParserMemberHeader).type + '"');
      }
    } else {
      // So it should be a method call...
      if (objectInstantiation && args.length === 0) {
        // Don't try to search it, this is the default constructor
        returnType = callee.identifier;
      } else {
        // Make sure for method exists on the object
        const method = callee.methods.find((meth: XpellaParserFunctionHeader) =>
        meth.identifier === identifier && this.compareArgsArrays(meth.args, headerArgs));

        if (!method) {
          this.inputStream.rewind(initialPosition);
          this.inputStream.throw('XP020D: Cannot find method ' + identifier + '('
            + headerArgs.join(', ') + ') on type "' + callee.identifier + '"');
        } else if (staticCall && !method.modifiers.some((mod) => mod === 'static')) {
          this.inputStream.rewind(initialPosition);
          this.inputStream.throw('XP020E: Cannot call non static method "' + method.identifier + '" without instance');
        } else {
          returnType = method.returnType;
        }
      }
    }

    if (!returnType) {
      // Just in case, should never happen
      this.inputStream.throw('XP020C: No return type found for method call ' + identifier
        + '(' + headerArgs.join(', ') + ')');
    }

    return new XpellaASTFunctionCall([], '', returnType, identifier, args);
  }
}
