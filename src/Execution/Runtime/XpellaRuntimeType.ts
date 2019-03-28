import { XpellaRuntimeAnnotation } from './XpellaRuntimeAnnotation';
import { XpellaRuntimeFunction } from './XpellaRuntimeFunction';

export class XpellaRuntimeType {
  public identifier: string;
  public annotations: XpellaRuntimeAnnotation[];

  public constructors: XpellaRuntimeFunction[];
  public operators: XpellaRuntimeFunction[];
  public methods: XpellaRuntimeFunction[];

  constructor(identifier: string) {
    this.identifier = identifier;
  }
}
