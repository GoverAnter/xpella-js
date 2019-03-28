import { XpellaRuntimeVariable } from './XpellaRuntimeVariable';

export class XpellaRuntimeAnnotation {
  public identifier: string;
  public args: XpellaRuntimeVariable[];

  constructor(identifier: string, args: XpellaRuntimeVariable[]) {
    this.identifier = identifier;
    this.args = args;
  }
}
