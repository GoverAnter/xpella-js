import { XpellaASTObjectCall } from './XpellaASTObjectCall';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTVariable } from './XpellaASTVariable';
import { XpellaASTNode } from './XpellaASTNode';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTObjectCallMember extends XpellaASTObjectCall {
  public static toBinaryAST(obj: XpellaASTObjectCallMember, codec: Codec) {
    const array: any[] = [obj.object, obj.member];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTObjectCallMember {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTObjectCallMember(array[2] ? array[2] : [], null, array[0], array[1]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x3A, XpellaASTObjectCallMember, (obj) => XpellaASTObjectCallMember.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x3A, (buf) => XpellaASTObjectCallMember.fromBinaryAST(buf, codec));
  }
  public member: XpellaASTVariable;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              object: XpellaASTExpression,
              member: XpellaASTVariable) {
    super(annotations, documentation, member.resolvedType, object);
    this.member = member;
  }

  public static isInstance(other: XpellaASTNode): other is XpellaASTObjectCallMember {
    return other instanceof XpellaASTObjectCallMember;
  }

  public equals(other: XpellaASTNode): boolean {
    if (XpellaASTObjectCallMember.isInstance(other)) {
      return other.object.equals(this.object) && other.member.equals(this.member);
    } else {
      return false;
    }
  }
}
