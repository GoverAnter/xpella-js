import { XpellaASTLiteral } from './XpellaASTLiteral';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTAnnotation {
  public static toBinaryAST(obj: XpellaASTAnnotation, codec: Codec) {
    const array: any[] = [obj.identifier];
    if (obj.args && obj.args.length > 0) {
      array.push(obj.args);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTAnnotation {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTAnnotation(array[0], array[1] ? array[1] : [], true);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x30, XpellaASTAnnotation, (obj) => XpellaASTAnnotation.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x30, (buf) => XpellaASTAnnotation.fromBinaryAST(buf, codec));
  }
  public identifier: string;
  public args: XpellaASTLiteral[];
  protected runtimeAnnotation: boolean;

  /** Provided args MUST ABSOLUTELY BE LITERALS */
  constructor(identifier: string, args: XpellaASTLiteral[] = [], runtimeAnnotation: boolean = true) {
    this.identifier = identifier;
    this.args = args;
    this.runtimeAnnotation = runtimeAnnotation;
  }

  public isRuntimeAnnotation(): boolean { return this.runtimeAnnotation; }

  public equals(other: XpellaASTAnnotation): boolean {
    if (other.identifier === this.identifier) {
      if (this.args.length !== other.args.length) {
        return false;
      }
      for (let i = 0; i < this.args.length; i++) {
        if (!this.args[i].equals(other.args[i])) {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }
}
