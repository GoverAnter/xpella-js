import { XpellaRuntimeType } from './XpellaRuntimeType';
import { XpellaRuntimeVisibility } from './XpellaRuntimeVisibility';
import { XpellaRuntimeVariableMetadatas } from './XpellaRuntimeVariableMetadatas';

export class XpellaRuntimeVariable extends XpellaRuntimeVariableMetadatas {
  public value: any;

  constructor(identifier: string, type: string, visibility: XpellaRuntimeVisibility, value?: any) {
    super(identifier, type, visibility);

    this.value = value;
  }
}
