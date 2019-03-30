import { XpellaRuntimeContext } from './context/XpellaRuntimeContext';
import { XpellaRuntimeVariable } from './XpellaRuntimeVariable';
import { XpellaBreakCommand } from './XpellaBreakCommand';

export type XpellaRuntimeHandler = (context: XpellaRuntimeContext) => null | XpellaRuntimeVariable | XpellaBreakCommand;
