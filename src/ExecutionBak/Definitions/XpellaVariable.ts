import { XpellaType } from "./XpellaType";
import { XpellaScope } from "./XpellaScope";

export class XpellaVariable {
  private identifier: string;
  private type: XpellaType;
  private scope: XpellaScope;
  value: any;

  constructor (identifier: string, value: any, type: XpellaType, scope: XpellaScope) {
    this.identifier = identifier;
    this.value = value;
    this.type = type;
    this.scope = scope;
  }

  getIdentifier () : string {
    return this.identifier;
  }

  getType () : XpellaType {
    return this.type;
  }

  getScope () : XpellaScope {
    return this.scope;
  }
}