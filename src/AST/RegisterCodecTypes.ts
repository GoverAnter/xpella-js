import { XpellaASTAnnotation } from './XpellaASTAnnotation';
import { XpellaASTAssignment } from './XpellaASTAssignment';
import { XpellaASTBackOperator } from './XpellaASTBackOperator';
import { XpellaASTBlock } from './XpellaASTBlock';
import { XpellaASTCondition } from './XpellaASTCondition';
import { XpellaASTExpressionOperator } from './XpellaASTExpressionOperator';
import { XpellaASTFrontOperator } from './XpellaASTFrontOperator';
import { XpellaASTFunctionCall } from './XpellaASTFunctionCall';
import { XpellaASTFunctionDeclaration } from './XpellaASTFunctionDeclaration';
import { XpellaASTLiteral } from './XpellaASTLiteral';
import { XpellaASTObjectCallMember } from './XpellaASTObjectCallMember';
import { XpellaASTObjectCallMethod } from './XpellaASTObjectCallMethod';
import { XpellaASTProgram } from './XpellaASTProgram';
import { XpellaASTTypeDeclaration } from './XpellaASTTypeDeclaration';
import { XpellaASTVariable } from './XpellaASTVariable';
import { XpellaASTVariableDeclaration } from './XpellaASTVariableDeclaration';
import { XpellaASTReturnStatement } from './XpellaASTReturnStatement';
import { XpellaASTStaticType } from './XpellaASTStaticType';

import { Codec } from 'msgpack-lite';

export function registerCodecTypes(codec: Codec) {
  XpellaASTAnnotation.addCodecInformations(codec);
  XpellaASTAssignment.addCodecInformations(codec);
  XpellaASTBackOperator.addCodecInformations(codec);
  XpellaASTBlock.addCodecInformations(codec);
  XpellaASTCondition.addCodecInformations(codec);
  XpellaASTExpressionOperator.addCodecInformations(codec);
  XpellaASTFrontOperator.addCodecInformations(codec);
  XpellaASTFunctionCall.addCodecInformations(codec);
  XpellaASTFunctionDeclaration.addCodecInformations(codec);
  XpellaASTLiteral.addCodecInformations(codec);
  XpellaASTObjectCallMember.addCodecInformations(codec);
  XpellaASTObjectCallMethod.addCodecInformations(codec);
  XpellaASTProgram.addCodecInformations(codec);
  XpellaASTTypeDeclaration.addCodecInformations(codec);
  XpellaASTVariable.addCodecInformations(codec);
  XpellaASTVariableDeclaration.addCodecInformations(codec);
  XpellaASTReturnStatement.addCodecInformations(codec);
  XpellaASTStaticType.addCodecInformations(codec);
}
