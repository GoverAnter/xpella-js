import { XpellaPrimitiveType } from "./XpellaPrimitiveType";

import { XpellaContext } from "../XpellaContext";
import { XpellaVariable } from "./XpellaVariable";
import { XpellaScope } from "./XpellaScope";
import { XpellaFunction } from "./XpellaFunction";
import { XpellaVariableMetadatas } from "./XpellaVariableMetadatas";

export class XpellaPrimitiveInt extends XpellaPrimitiveType {
  constructor () {
    super('int', [], []);

    let copyConstructorHandler: Function = (context: XpellaContext) => {
      context.assignMemoryValue('this', context.getMemoryValue('other'));
    }
    this.addFunction(new XpellaFunction(copyConstructorHandler, 'int', XpellaScope.OBJECT_PUBLIC, null, [new XpellaVariableMetadatas('other', this, XpellaScope.LOCAL)]));
  }

  createFromLiteral (literal: string) : XpellaVariable {
    // Parse the value
    return new XpellaVariable(null, +literal, this, XpellaScope.LOCAL);
  }

  assignFromSelf (instance: XpellaVariable, toBeAssigned: XpellaVariable) : void {
    instance.value = toBeAssigned.value;
  }
}