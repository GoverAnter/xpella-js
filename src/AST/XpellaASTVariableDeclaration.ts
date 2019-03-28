import { XpellaASTDeclaration } from './XpellaASTDeclaration';
import { XpellaASTExpression } from './XpellaASTExpression';
import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTLiteral } from './XpellaASTLiteral';

import { encode, decode, Codec } from 'msgpack-lite';
import { XpellaParserVisibilities } from '../Parser/Definitions/XpellaKeywords';

export class XpellaASTVariableDeclaration extends XpellaASTDeclaration {

  public static toBinaryAST(obj: XpellaASTVariableDeclaration, codec: Codec) {
    const array: any[] = [obj.identifier, obj.type, XpellaParserVisibilities.indexOf(obj.visibility),
                          obj.modifiers.length ? obj.modifiers : null, obj.initialAssignation];
    const runtimeAnnotations = obj.getRuntimeAnnotations();
    if (runtimeAnnotations.length > 0) {
      array.push(runtimeAnnotations);
    }
    return encode(array, {codec});
  }

  public static fromBinaryAST(buffer: Buffer | Uint8Array | number[], codec: Codec): XpellaASTVariableDeclaration {
    const array: any[] = decode(buffer, {codec});
    return new XpellaASTVariableDeclaration(array[5] ? array[5] : [], null, array[0], array[1],
                                            XpellaParserVisibilities[array[2]], array[3] ? array[3] : [], array[4]);
  }

  public static addCodecInformations(codec: Codec): void {
    codec.addExtPacker(0x3F, XpellaASTVariableDeclaration,
                       (obj) => XpellaASTVariableDeclaration.toBinaryAST(obj, codec));
    codec.addExtUnpacker(0x3F, (buf) => XpellaASTVariableDeclaration.fromBinaryAST(buf, codec));
  }
  public type: string;
  public visibility: string;
  public modifiers: string[];
  public initialAssignation: XpellaASTExpression;

  constructor(annotations: XpellaASTAnnotation[],
              documentation: string,
              identifier: string,
              type: string,
              visibility: string,
              modifiers: string[],
              initialAssignation: XpellaASTExpression = new XpellaASTLiteral([], '', null, null)) {
    super(annotations, documentation, identifier);
    this.type = type;
    this.visibility = visibility;
    this.modifiers = modifiers;
    this.initialAssignation = initialAssignation;
  }
}
