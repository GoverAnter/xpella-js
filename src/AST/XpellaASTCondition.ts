import { XpellaASTStatement } from './XpellaASTStatement';
import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTNode } from './XpellaASTNode';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTCondition extends XpellaASTStatement {
  public static toBinaryAST(obj: XpellaASTCondition, codec: Codec) {
    const array: any[] = [obj.condition, obj.passConditionExecution, obj.failConditionExecution];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTCondition {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTCondition(array[3] ? array[3] : [], null, array[0], array[1], array[2]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x34, XpellaASTCondition, (obj) => XpellaASTCondition.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x34, (buf) => XpellaASTCondition.fromBinaryAST(buf, codec));
  }
  public condition: XpellaASTExpression;
  public passConditionExecution: XpellaASTStatement;
  public failConditionExecution: XpellaASTStatement;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              condition: XpellaASTExpression,
              passConditionExecution: XpellaASTStatement,
              failConditionExecution: XpellaASTStatement) {
    super(annotations, documentation);
    this.condition = condition;
    this.passConditionExecution = passConditionExecution;
    this.failConditionExecution = failConditionExecution;
  }

  public static isInstance(other: XpellaASTNode): other is XpellaASTCondition {
    return other instanceof XpellaASTCondition;
  }

  public equals(other: XpellaASTNode): boolean {
    if (XpellaASTCondition.isInstance(other)) {
      return other.condition.equals(this.condition) &&
        ((other.passConditionExecution !== null && other.passConditionExecution.equals(this.passConditionExecution)) || this.passConditionExecution == null) &&
        ((other.failConditionExecution !== null && other.failConditionExecution.equals(this.failConditionExecution)) || this.failConditionExecution == null);
    } else {
      return false;
    }
  }
}
