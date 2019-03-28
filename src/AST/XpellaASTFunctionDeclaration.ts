import { XpellaASTDeclaration } from './XpellaASTDeclaration';
import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTBlock } from './XpellaASTBlock';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaParserVisibilities } from '../Parser/Definitions/XpellaKeywords';
import { XpellaASTVariableDeclaration } from './XpellaASTVariableDeclaration';

import { encode, decode, Codec } from 'msgpack-lite';

export class XpellaASTFunctionDeclaration extends XpellaASTDeclaration {
  public static toBinaryAST(obj: XpellaASTFunctionDeclaration, codec: Codec) {
    // Put null in case we have annotations, so that it does not end up mixed
    const array: any[] = [
      obj.identifier,
      XpellaParserVisibilities.indexOf(obj.visibility),
      obj.modifiers.length === 0 ? null : obj.modifiers,
      obj.returnType === 'void' ? null : obj.returnType,
      obj.args.length === 0 ? null : obj.args,
      obj.execution
    ];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTFunctionDeclaration {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTFunctionDeclaration(array[6] ? array[6] : [], null,
                                            array[0],
                                            XpellaParserVisibilities[array[1]],
                                            array[2] ? array[2] : [],
                                            array[3] ? array[3] : 'void',
                                            array[4] ? array[4] : [],
                                            array[5]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x38, XpellaASTFunctionDeclaration,
                       (obj) => XpellaASTFunctionDeclaration.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x38, (buf) => XpellaASTFunctionDeclaration.fromBinaryAST(buf, codec));
  }
  public visibility: string;
  public modifiers: string[];
  public returnType: string;
  public args: XpellaASTVariableDeclaration[];
  public execution: XpellaASTBlock;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              identifier: string,
              visibility: string,
              modifiers: string[],
              returnType: string,
              args: XpellaASTVariableDeclaration[],
              execution: XpellaASTBlock) {
    super(annotations, documentation, identifier);
    this.visibility = visibility;
    this.modifiers = modifiers;
    this.returnType = returnType;
    this.args = args;
    this.execution = execution;
  }
}
