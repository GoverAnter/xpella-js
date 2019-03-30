import { XpellaRuntimeVariable } from "./XpellaRuntimeVariable";

export class XpellaBreakCommand {
  public breakValue?: XpellaRuntimeVariable;

  constructor(breakValue?: XpellaRuntimeVariable) {
    this.breakValue = breakValue;
  }
}