import { XpellaRuntimeType } from "./XpellaRuntimeType";
import { XpellaRuntimeVariable } from "../XpellaRuntimeVariable";

export abstract class XpellaRuntimePrimitiveType extends XpellaRuntimeType {
  public abstract createFromLiteral (literal: any) : XpellaRuntimeVariable;
}