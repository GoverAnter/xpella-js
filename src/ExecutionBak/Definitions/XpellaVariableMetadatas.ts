import { XpellaType } from "./XpellaType";
import { XpellaScope } from "./XpellaScope";

export class XpellaVariableMetadatas {
  private identifier: string;
  private type: XpellaType;
  private scope: XpellaScope;

  constructor (identifier: string, type: XpellaType, scope: XpellaScope) {
    this.identifier = identifier;
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