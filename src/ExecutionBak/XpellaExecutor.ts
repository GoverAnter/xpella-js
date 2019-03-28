import { XpellaContext } from './XpellaContext';

import { XpellaType } from './Definitions/XpellaType';
import { XpellaFunction } from './Definitions/XpellaFunction';

export class XpellaExecutor {
  private executionHandler: (context: XpellaContext) => any;
  private runtimeTypes: XpellaType[];
  private runtimeFunctions: XpellaFunction[];

  constructor(executionHandler: (context: XpellaContext) => any,
              runtimeTypes: XpellaType[],
              runtimeFunctions: XpellaFunction[]) {
    this.executionHandler = executionHandler;
    this.runtimeTypes = runtimeTypes;
    this.runtimeFunctions = runtimeFunctions;
  }

  public execute(context: XpellaContext): any {
    this.executionHandler(context);
  }
}
