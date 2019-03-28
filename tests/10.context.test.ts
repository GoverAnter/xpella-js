import { expect } from 'chai';

import { XpellaContext } from '../src/Execution/XpellaContext';
import { XpellaVariable } from '../src/Definitions/XpellaVariable';
import { XpellaTypes } from '../src/Definitions/XpellaTypes';
import { XpellaScope } from '../src/Definitions/XpellaScope';

describe('Xpella context', () => {
  it('Successful object creation without initializer', () => {
    const context = new XpellaContext();
    expect(context).to.be.instanceOf(XpellaContext);
  });
  it('Cannot access an undeclared memory value', () => {
    const context = new XpellaContext();
    expect(() => { context.getMemoryValue('a'); }).to.throw('"a" is undeclared');
  });
  it('Can declare a memory variable', () => {
    const context = new XpellaContext();
    context.declareMemoryValue('a', new XpellaVariable('a', 0, XpellaTypes.int, XpellaScope.LOCAL));
    expect(context.getMemoryValue('a').value).to.equal(0);
  });
  it('Cannot redeclare a memory variable', () => {
    const context = new XpellaContext();
    context.declareMemoryValue('a', new XpellaVariable('a', 0, XpellaTypes.int, XpellaScope.LOCAL));
    expect(() => { context.declareMemoryValue('a', new XpellaVariable('a', 0, XpellaTypes.int, XpellaScope.LOCAL)); })
      .to.throw('"a" is already declared');
  });
  it('Cannot assign an undeclared memory variable', () => {
    const context = new XpellaContext();
    expect(() => { context.assignMemoryValue('a', new XpellaVariable('a', 0, XpellaTypes.int, XpellaScope.LOCAL)); })
      .to.throw('"a" is undeclared');
  });
  it('Can assign a declared memory variable', () => {
    const context = new XpellaContext();
    context.declareMemoryValue('a', new XpellaVariable('a', 0, XpellaTypes.int, XpellaScope.LOCAL));
    expect(context.getMemoryValue('a').value).to.equal(0);
    context.assignMemoryValue('a', new XpellaVariable('a', 1, XpellaTypes.int, XpellaScope.LOCAL));
    expect(context.getMemoryValue('a').value).to.equal(1);
  });
  it('Declaration identifier is correct', () => {
    const context = new XpellaContext();
    context.declareMemoryValue('a', new XpellaVariable('a', 0, XpellaTypes.int, XpellaScope.LOCAL));
    expect(context.getMemoryValue('a').getIdentifier()).to.equal('a');
  });
  it('Assignation identifier is correct', () => {
    const context = new XpellaContext();
    context.declareMemoryValue('a', new XpellaVariable('a', 0, XpellaTypes.int, XpellaScope.LOCAL));
    context.assignMemoryValue('a', new XpellaVariable('a', 1, XpellaTypes.int, XpellaScope.LOCAL));
    expect(context.getMemoryValue('a').getIdentifier()).to.equal('a');
  });
});
