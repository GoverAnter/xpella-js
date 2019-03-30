import { XpellaRuntimeAnnotation } from '../XpellaRuntimeAnnotation';
import { XpellaRuntimeFunction } from '../XpellaRuntimeFunction';
import { XpellaRuntimeContext } from '../context/XpellaRuntimeContext';
import { XpellaRuntimeVariable } from '../XpellaRuntimeVariable';

export class XpellaRuntimeType {
  public identifier: string;
  public annotations: XpellaRuntimeAnnotation[];

  public constructors: XpellaRuntimeFunction[];
  public operators: XpellaRuntimeFunction[];
  public methods: XpellaRuntimeFunction[];

  constructor(annotations: XpellaRuntimeAnnotation[],
    identifier: string,
    constructors: XpellaRuntimeFunction[],
    operators: XpellaRuntimeFunction[],
    methods: XpellaRuntimeFunction[]) {
    this.annotations = annotations;
    this.identifier = identifier;
    this.constructors = constructors;
    this.operators = operators;
    this.methods = methods;
  }

  public callOperator(context: XpellaRuntimeContext, instance: XpellaRuntimeVariable, identifier: string, args: XpellaRuntimeVariable[]) {
    const opMethod = this.operators.find((val) => val.identifier === identifier);

    if (!opMethod) {
      throw new Error('XP1100: Operator "' + identifier + '" not found on type "' + this.identifier + '"');
    }

    context.setThisContext(instance);

    const retVal = opMethod.call(context, args);

    context.clearThisContext();

    return retVal;
  }
}
