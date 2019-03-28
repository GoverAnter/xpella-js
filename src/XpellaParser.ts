import { XpellaExecutor } from './Execution/XpellaExecutor';
import { XpellaContext } from './Execution/XpellaContext';

import { InvalidParseInputError } from './Errors/InvalidParseInputError';

import { XpellaType } from './Definitions/XpellaType';
import { XpellaFunction } from './Definitions/XpellaFunction';
import { XpellaTypes } from './Definitions/XpellaTypes';
import { XpellaTypeError, XpellaTypeErrors } from './Errors/XpellaTypeError';
import { XpellaParseError, XpellaParseErrors } from './Errors/XpellaParseError';
import { XpellaVariable } from './Definitions/XpellaVariable';
import { XpellaScope } from './Definitions/XpellaScope';
import { XpellaInputStream } from './Parser/Helpers/XpellaInputStream';

/**
 * How it works :
 * 1) We sanitize the input code (remove duplicate spaces and semicolon, remove new lines, trim from spaces and semicolon)
 * 2) We break the code into blocks (so a function/class declaration, a structure, a single line)
 */
export class XpellaParser {
  static readonly BLOCKS : Array<string> = ['type', 'function'];
  static readonly CONSTRUCTS : Array<string> = ['if', 'else', 'do', 'while', 'for'];

  constructor () {}

  parseRightExpression (parserInstance: XpellaInputStream, expression: string): Function {
    if (!expression) {
      parserInstance.throw('Expression expected');
    }
    // Find the type of the right expression
    // It should be either a call to a method, or an assignation from a variable, or an assignation from a literal
    // If it is from a literal, try to find literal type
    if (expression[0].match(/\d/)) {
      // This is a number literal
      let value = XpellaTypes.int.createFromLiteral(expression);
      return (context: XpellaContext) => {
        return value;
      }
    }
    return (context: XpellaContext) => {}
  }

  resolveType (parserInstance: XpellaInputStream, expression: string) : XpellaType {
    switch (expression) {
      case 'any':
        return null; // Can't determine a type, will need to guess it from value
      case 'int':
        return XpellaTypes.int;
      default:
        throw new XpellaTypeError(expression, null, XpellaTypeErrors.UNKNOWN);
    }
  }

  parseLine (parserInstance: XpellaInputStream, line: string) : Function {
    // Sanitize line
    let sanitizedLine = line.trim();

    // (type)? (identifier) = (value)
    let assignationMatch = /(?:(any|int)\s)?([a-zA-Z0-9_-]+)\s?=\s?(.+)/.exec(sanitizedLine);
    if (assignationMatch !== null) {
      let rightExpr: XpellaVariable = this.parseRightExpression(parserInstance, assignationMatch[3])(context);
      if (assignationMatch[1] !== undefined) {
        // This is an declaration, because we have a type
        // Find a matching constructor and then runtime-call it
        // Constructor resolution in that case is compile-time, because we don't need it runtime
        // as we don't allow direct modifications on tree after parse
        // However, it can also be done runtime, for example in the case of an anonymous object
        // or from a reflection call
        let constructor = rightExpr.getType().findMatchingConstructor([rightExpr.getType()]);
        let args = constructor.prepareArgs([rightExpr]);
        return (context: XpellaContext) => {
          // Instantiate a new value of the matching type by calling the copy constructor
          rightExpr.getType().instantiateCompileTime(context, assignationMatch[2], XpellaScope.LOCAL, constructor, args);
        }
      } else {
        return (context: XpellaContext) => {
          context.assignMemoryValue(assignationMatch[2], rightExpr);
        }
      }
    }

    let declarationMatch = /(any|int)\s([a-zA-Z0-9_-]+)/.exec(sanitizedLine);
    if (declarationMatch !== null) {
      if (declarationMatch[1] === 'any') {
        // We can't declare a variable with any with no values
        throw new XpellaParseError(XpellaParseErrors.NO_ANY_DECL);
      } else {
        let type = this.resolveType(parserInstance, declarationMatch[1]);
        return (context: XpellaContext) => {
          context.declareMemoryValue(declarationMatch[2], new XpellaVariable(declarationMatch[2], null, type, XpellaScope.LOCAL));
        }
      }
    }
    
    return (context: XpellaContext) => {}
  }

  parseBlock (parserInstance: XpellaInputStream, block: string) : Function {
    return (context: XpellaContext) => {}
  }

  parse (code: string) : XpellaExecutor {
    if (code === undefined || code === null || code === '') {
      throw new InvalidParseInputError();
    }
    let parserInstance = new XpellaInputStream(code, null);

    let execBlocks : Array<Function> = [];
    let runtimeTypes : Array<XpellaType> = [];
    let runtimeFunctions : Array<XpellaFunction> = [];

    // Kept here for backup until [insert a reason here]
    let currentPos = 0;

    while (currentPos !== code.length) {
      // Try to find a block (construct, definition or single line)
      // XpellaParser.CONSTRUCTS.forEach(construct => {
      //   if (sanitizedCode.startsWith(construct, currentPos)) {
      //     // Find the matching bracket of the closing block
      //   }
      // })

      // Break at each semicolon
      let nextSemicolon = code.indexOf(';', currentPos);
      if (nextSemicolon !== -1) {
        execBlocks.push(this.parseLine(parserInstance, code.slice(currentPos, nextSemicolon)));
        currentPos = nextSemicolon + 1;
      } else {
        execBlocks.push(this.parseLine(parserInstance, code.slice(currentPos, code.length)));
        currentPos = code.length;
      }
    }

    return new XpellaExecutor((context: XpellaContext) => {
      execBlocks.forEach(block => { block(context) })
    }, runtimeTypes, runtimeFunctions)
  }
}