import { XpellaType } from "./XpellaType";
import { XpellaVariable } from "./XpellaVariable";

export abstract class XpellaPrimitiveType extends XpellaType {
  abstract createFromLiteral (literal: string) : XpellaVariable;
}