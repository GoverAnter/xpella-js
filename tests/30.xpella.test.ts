import { expect } from 'chai';

import { Xpella } from '../src/Xpella';
import { XpellaContext } from '../src/Execution/XpellaContext';

describe('Xpella', () => {
  it('Successful object creation without initializer', () => {
    const xpella = new Xpella();
    expect(xpella).to.be.instanceOf(Xpella);
  });

  it('Successful context creation without initializer', () => {
    const xpella = new Xpella();
    expect(xpella.createContext()).to.be.instanceOf(XpellaContext);
  });
});
