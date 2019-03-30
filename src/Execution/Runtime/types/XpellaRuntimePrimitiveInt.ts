import { XpellaRuntimePrimitiveType } from "./XpellaRuntimePrimitiveType";
import { XpellaRuntimeVariable } from "../XpellaRuntimeVariable";
import { XpellaRuntimeVisibility } from "../XpellaRuntimeVisibility";
import { XpellaRuntimeFunction } from "../XpellaRuntimeFunction";
import { XpellaRuntimeFunctionArgument } from "../XpellaRuntimeFunctionArgument";

export class XpellaRuntimePrimitiveInt extends XpellaRuntimePrimitiveType {
  constructor() {
    super([], 'int', [], [], []);

    this.operators.push(new XpellaRuntimeFunction('++', XpellaRuntimeVisibility.PUBLIC, 'int', (context) => {
      const initialVal = context.getThisContext();
      const copyVal = new XpellaRuntimeVariable(initialVal.identifier, initialVal.type, initialVal.visibility, initialVal.value);
      context.getThisContext().value = initialVal.value + 1;
      return copyVal;
    }, []));

    this.operators.push(new XpellaRuntimeFunction('+', XpellaRuntimeVisibility.PUBLIC, 'int', (context) => {
      const arg = context.getMemoryValue('other');
      context.getThisContext().value = context.getThisContext().value + arg.value;
      return context.getThisContext();
    }, [new XpellaRuntimeFunctionArgument('other', 'int')]));
  }

  public createFromLiteral (literal: any) : XpellaRuntimeVariable {
    return new XpellaRuntimeVariable(null, 'int', XpellaRuntimeVisibility.PUBLIC, +literal);
  }
}