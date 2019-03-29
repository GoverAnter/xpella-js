import { XpellaRuntimeAnnotation } from './XpellaRuntimeAnnotation';
import { XpellaRuntimeFunction } from './XpellaRuntimeFunction';

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
}
