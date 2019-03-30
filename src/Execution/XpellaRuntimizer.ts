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

export function runtimizeBlock(block: XpellaASTBlock): XpellaRuntimeHandler {
  // TODO Handle edge cases (no statements or null array)
  const handlers: XpellaRuntimeHandler[] = block.statements.map((st) => runtimizeStatement(st));

  return (context) => {
    for (const handler of handlers) {
      handler(context);
    }
  };
}

export function runtimizeExecution(execution: XpellaASTStatement[]): XpellaRuntimeHandler {
  // TODO Handle edge cases (no statements or null array)
  const handlers: XpellaRuntimeHandler[] = execution.map((st) => runtimizeStatement(st));

  return (context) => {
    for (const handler of handlers) {
      handler(context);
    }
  };
}

export function runtimizeExpression(expression: XpellaASTExpression): XpellaRuntimeHandler {
  if(XpellaASTBackOperator.isInstance(expression)) {
    return (context) => {
      const variable = context.getMemoryValue(expression.right.identifier);
      return context.types[variable.type].operators.find((val) => val.identifier === expression.operator).handler(context);
    };
  } else if(XpellaASTFrontOperator.isInstance(expression)) {
    return (context) => {
      const variable = context.getMemoryValue(expression.left.identifier);
      return context.types[variable.type].operators.find((val) => val.identifier === expression.operator).handler(context);
    };
  }
}

export function runtimizeStatement(statement: XpellaASTStatement): XpellaRuntimeHandler {
  if (XpellaASTVariableDeclaration.isInstance(statement)) {
    const initialValueHandler = statement.initialAssignation ? (): any => null : runtimizeExpression(statement.initialAssignation);
    return (context) => context.declareMemoryValue(statement.identifier, new XpellaRuntimeVariable(statement.identifier, statement.type, initialValueHandler(context)))
  } else if (XpellaASTExpression.isInstance(statement)) {
    return runtimizeExpression(statement);
  }
}
