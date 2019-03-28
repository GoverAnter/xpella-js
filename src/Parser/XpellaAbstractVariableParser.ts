import { XpellaAbstractParser } from './XpellaAbstractParser';
import { XpellaASTLiteral } from '../AST/XpellaASTLiteral';
import {
  XpellaParserStringDelimiters,
  XpellaParserStringEscape,
  XpellaParserThisKeyword
} from './Definitions/XpellaKeywords';
import { XpellaASTVariable } from '../AST/XpellaASTVariable';
import { XpellaASTExpression } from '../AST/XpellaASTExpression';
import { XpellaASTStaticType } from '../AST/XpellaASTStaticType';

// Exception codes:
// Current file: XP01xx
// Last exception: XP0106
export abstract class XpellaAbstractVariableParser extends XpellaAbstractParser {
  /** Tries to match a literal (either int, float, string or boolean) or a variable name */
  public resolveVariableOrLiteral(): XpellaASTExpression {
    // Eat whitespaces
    this.lexer.skipWhitespaces(false);

    if (XpellaParserStringDelimiters.indexOf(this.inputStream.peek()) !== -1) {
      return this.resolveStringLiteral();
    } else if (this.inputStream.peek() === '.') {
      // This may be a decimal separator
      const initialPos = this.inputStream.getCurrentPosition();
      this.inputStream.next();
      const potentialNumber = this.lexer.readWord();
      this.inputStream.rewind(initialPos);
      if (!isNaN(Number(potentialNumber))) {
        // Definitely a floating number
        return this.resolveNumberLiteral();
      } else {
        // This should be an object call without object identifier
        this.inputStream.throw('XP0100: Expected object identifier');
      }
    }

    const initialPosition = this.inputStream.getCurrentPosition();
    const word = this.lexer.readWord();

    if (!word) {
      this.inputStream.throw('XP0101: Expected variable name or literal value');
    }

    if (word === 'null') {
      // The null value
      return new XpellaASTLiteral([], '', null, null);
    } else if (word === 'true') {
      // This is the boolean value
      return new XpellaASTLiteral([], '', true, 'boolean');
    } else if (word === 'false') {
      // This is the boolean value
      return new XpellaASTLiteral([], '', false, 'boolean');
    } else if (word === XpellaParserThisKeyword) {
      if (!this.currentThis) {
        this.inputStream.rewind(initialPosition);
        this.inputStream.throw('XP0106: No "this" is present in this context');
      }
      return new XpellaASTVariable([], '', this.currentThis.identifier, 'this');
    } else if (/\d/.test(word[0])) {
      // This is a number literal
      this.inputStream.rewind(initialPosition);
      return this.resolveNumberLiteral();
    } else {
      // If the type exists, then this is a type
      if (this.typeExists(word)) {
        return new XpellaASTStaticType([], '', word);
      } else {
        const variable = this.getVariable(word);
        // Must be a variable name
        return new XpellaASTVariable([], '', variable.type, word);
      }
    }
  }

  /** Resolves a string in its delimiter */
  public resolveStringLiteral(): XpellaASTLiteral {
    // Eat whitespaces
    this.lexer.skipWhitespaces(false);

    const delimiter = this.inputStream.peek();
    if (XpellaParserStringDelimiters.indexOf(delimiter) === -1) {
      this.inputStream.throw('XP0102: Expected "' + delimiter + '" to be a literal string delimiter');
    }
    this.inputStream.next();

    const str = this.lexer.readWhile((char: string, last: string) =>
      char !== delimiter || last === XpellaParserStringEscape);

    this.lexer.eatChar(delimiter);

    return new XpellaASTLiteral([], '', str, 'string');
  }

  /** Resolves a number (either a int or a float) */
  public resolveNumberLiteral(): XpellaASTLiteral {
    // Numbers can either be 0.0 or .0
    // Eat whitespaces
    this.lexer.skipWhitespaces(false);

    if (this.inputStream.peek() === '.') {
      // This may be a decimal separator
      this.inputStream.next();
      const initialPos = this.inputStream.getCurrentPosition();
      const word = this.lexer.readWord();

      if (!isNaN(Number(word))) {
        // Definitely a floating number
        return new XpellaASTLiteral([], '', Number('0.' + word), 'float');
      } else {
        // This is not what we expected
        this.inputStream.rewind(initialPos);
        this.inputStream.throw('XP0103: Expected floating number');
      }
    }

    const initialPosition = this.inputStream.getCurrentPosition();

    // Read the first group
    const num = this.lexer.readWord();

    if (isNaN(Number(num))) {
      this.inputStream.rewind(initialPosition);
      this.inputStream.throw('XP0104: Expected "' + num + '" to be a number (int or float)');
    }

    // Check if it is a decimal
    if (this.inputStream.peek() === '.') {
      // Read decimal part
      this.inputStream.next();
      const dec = this.lexer.readWord();

      if (isNaN(Number(dec))) {
        this.inputStream.rewind(initialPosition);
        this.inputStream.throw('XP0105: Expected "' + num + '.' + dec + '" to be a float');
      } else {
        return new XpellaASTLiteral([], '', Number(num + '.' + dec), 'float');
      }
    } else {
      return new XpellaASTLiteral([], '', Number(num), 'int');
    }
  }
}
