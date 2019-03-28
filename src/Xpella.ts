import { XpellaContext } from './Execution/XpellaContext';

export class Xpella {
  constructor () {
  }

  createContext () : XpellaContext {
    return new XpellaContext();
  }
}