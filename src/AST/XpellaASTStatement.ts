import { XpellaASTNode } from './XpellaASTNode';

export abstract class XpellaASTStatement extends XpellaASTNode {
  public abstract equals(other: XpellaASTStatement): boolean;
}
