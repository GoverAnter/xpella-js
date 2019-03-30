import { XpellaRuntimeType } from './types/XpellaRuntimeType';
import { XpellaRuntimeVisibility } from './XpellaRuntimeVisibility';

export class XpellaRuntimeVariableMetadatas {
  public identifier: string;
  public type: string;
  public visibility: XpellaRuntimeVisibility;

  constructor(identifier: string, type: string, visibility: XpellaRuntimeVisibility, value?: any) {
    this.identifier = identifier;
    this.type = type;
    this.visibility = visibility;
  }
}
