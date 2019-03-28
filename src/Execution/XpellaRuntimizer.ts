import { XpellaASTExpression } from '../AST/XpellaASTExpression';
import { XpellaASTStatement } from '../AST/XpellaASTStatement';
import { XpellaRuntimeHandler } from './Runtime/XpellaRuntimeHandler';
import { XpellaASTBlock } from '../AST/XpellaASTBlock';

export function runtimizeBlock(block: XpellaASTBlock): XpellaRuntimeHandler {}

export function runtimizeExecution(execution: XpellaASTStatement[]): XpellaRuntimeHandler {}

export function runtimizeExpression(expression: XpellaASTExpression): XpellaRuntimeHandler {}

export function runtimizeStatement(statement: XpellaASTStatement): XpellaRuntimeHandler {}
