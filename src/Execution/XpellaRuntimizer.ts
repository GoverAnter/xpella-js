import { XpellaASTExpression } from '../AST/XpellaASTExpression';
import { XpellaASTStatement } from '../AST/XpellaASTStatement';
import { XpellaRuntimeHandler } from './Runtime/XpellaRuntimeHandler';
import { XpellaASTBlock } from '../AST/XpellaASTBlock';
import { XpellaASTBackOperator } from '../AST/XpellaASTBackOperator';
import { XpellaASTFrontOperator } from '../AST/XpellaASTFrontOperator';
import { RuntimeTypes } from './XpellaExecutor';
import { XpellaASTVariableDeclaration } from '../AST/XpellaASTVariableDeclaration';
import { XpellaRuntimeVariable } from './Runtime/XpellaRuntimeVariable';
import { XpellaRuntimeContext } from './Runtime/context/XpellaRuntimeContext';
import { XpellaBreakCommand } from './Runtime/XpellaBreakCommand';
import { XpellaASTLiteral } from '../AST/XpellaASTLiteral';
import { XpellaRuntimeVisibility } from './Runtime/XpellaRuntimeVisibility';
import { XpellaASTReturnStatement } from '../AST/XpellaASTReturnStatement';
import { XpellaASTExpressionOperator } from '../AST/XpellaASTExpressionOperator';
import { XpellaASTVariable } from '../AST/XpellaASTVariable';

export function runtimizeBlock(block: XpellaASTBlock): XpellaRuntimeHandler {
  // TODO Handle edge cases (no statements or null array)
  const handlers: XpellaRuntimeHandler[] = block.statements.map((st) => runtimizeStatement(st));

  return (context) => {
    let curVal = null;
    for (const handler of handlers) {
      curVal = handler(context);
      if (curVal instanceof XpellaBreakCommand) {
        return curVal;
      }
    }
    return curVal;
  };
}

export function runtimizeExecution(execution: XpellaASTStatement[]): XpellaRuntimeHandler {
  // TODO Handle edge cases (no statements or null array)
  const handlers: XpellaRuntimeHandler[] = execution.map((st) => runtimizeStatement(st));

  return (context) => {
    let curVal = null;
    for (const handler of handlers) {
      curVal = handler(context);
      if (curVal instanceof XpellaBreakCommand) {
        return curVal;
      }
    }
    return curVal;
  };
}

export function runtimizeExpression(expression: XpellaASTExpression): XpellaRuntimeHandler {
  if (XpellaASTExpressionOperator.isInstance(expression)) {
    const leftExpr = runtimizeExpression(expression.left);
    const rightExpr = runtimizeExpression(expression.right);
    return (context) => {
      const rightVal = rightExpr(context);
      const variable = leftExpr(context);
      if (rightVal instanceof XpellaBreakCommand || variable instanceof XpellaBreakCommand) {
        throw new Error('XP1200: Break command not allowed here');
      }
      return context.types[variable.type].callOperator(context, variable, expression.operator, [rightVal]);
    };
  } else if (XpellaASTBackOperator.isInstance(expression)) {
    return (context) => {
      const variable = context.getMemoryValue(expression.right.identifier);
      return context.types[variable.type].callOperator(context, variable, expression.operator, []);
    };
  } else if (XpellaASTFrontOperator.isInstance(expression)) {
    return (context) => {
      const variable = context.getMemoryValue(expression.left.identifier);
      return context.types[variable.type].callOperator(context, variable, expression.operator, []);
    };
  } else if (XpellaASTVariable.isInstance(expression)) {
    return (context) => {
      return context.getMemoryValue(expression.identifier);
    };
  } else if (XpellaASTLiteral.isInstance(expression)) {
    return (context) => new XpellaRuntimeVariable(null, expression.resolvedType, XpellaRuntimeVisibility.PUBLIC, expression.value);
  }
}

export function runtimizeStatement(statement: XpellaASTStatement): XpellaRuntimeHandler {
  if (XpellaASTVariableDeclaration.isInstance(statement)) {
    const initialValueHandler = statement.initialAssignation ? runtimizeExpression(statement.initialAssignation) : (): any => null;
    return (context) => {
      let initialValue = initialValueHandler(context);
      if (initialValue instanceof XpellaRuntimeVariable) {
        initialValue = initialValue.value;
      } else if (initialValue instanceof XpellaBreakCommand) {
        initialValue = initialValue.breakValue;
      }
      context.declareMemoryValue(new XpellaRuntimeVariable(statement.identifier, statement.type, XpellaRuntimeVisibility.PUBLIC, initialValue));
      return null;
    };
  } else if (XpellaASTExpression.isInstance(statement)) {
    return runtimizeExpression(statement);
  } else if (XpellaASTReturnStatement.isInstance(statement)) {
    const expr = runtimizeExpression(statement.expression);
    return (context) => {
      const returnValue = expr(context);
      if (returnValue instanceof XpellaBreakCommand) {
        return returnValue;
      } else {
        return new XpellaBreakCommand(returnValue);
      }
    }
  }
}
