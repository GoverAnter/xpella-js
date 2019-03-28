import { XpellaASTAnnotation } from './XpellaASTAnnotation';

export abstract class XpellaASTNode {
  public annotations: XpellaASTAnnotation[];
  public documentation: string;
  protected runtimeAST: boolean;

  constructor(annotations: XpellaASTAnnotation[], documentation: string) {
    this.annotations = annotations;
    this.documentation = documentation;

    if (documentation === null) {
      this.runtimeAST = true;
    }
  }

  public getRuntimeAnnotations(): XpellaASTAnnotation[] {
    return this.annotations.filter((annotation: XpellaASTAnnotation) => annotation.isRuntimeAnnotation());
  }

  public isRuntimeAST(): boolean { return this.runtimeAST; }

  public compareAnnotations(other: XpellaASTNode): boolean {
    if (this.annotations.length !== other.annotations.length) {
      return false;
    }
    for (let i = 0; i < this.annotations.length; i++) {
      if (!this.annotations[i].equals(other.annotations[i])) {
        return false;
      }
    }

    return true;
  }
}
