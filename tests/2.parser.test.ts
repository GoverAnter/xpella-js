import { expect } from 'chai';

import { XpellaParser } from '../src/XpellaParser';
import { XpellaExecutor } from '../src/Execution/XpellaExecutor';
import { XpellaContext } from '../src/Execution/XpellaContext';
import { XpellaVariable } from '../src/Execution/Definitions/XpellaVariable';
import { XpellaTypes } from '../src/Execution/Definitions/XpellaTypes';
import { XpellaScope } from '../src/Execution/Definitions/XpellaScope';

describe('Xpella parser', () => {
  it('Successful parser creation without options', () => {
    const parser = new XpellaParser();
    expect(parser).to.be.instanceOf(XpellaParser);
  });
  it('Cannot parse invalid text', () => {
    const parser = new XpellaParser();
    expect(() => { parser.parse(undefined); }).to.throw();
    expect(() => { parser.parse(null); }).to.throw();
    expect(() => { parser.parse(''); }).to.throw();
  });
  it('Parse single line variable declaration', () => {
    const parser = new XpellaParser();
    const code = 'int a = 0;';
    expect(parser.parse(code)).to.be.instanceOf(XpellaExecutor);
  });
  it('Parse single line variable assignation', () => {
    const parser = new XpellaParser();
    const code = 'a = 0;';
    expect(parser.parse(code)).to.be.instanceOf(XpellaExecutor);
  });
  it('Assignation without declaration throws a runtime exception', () => {
    const parser = new XpellaParser();
    const code = 'a = 0;';
    const executor = parser.parse(code);
    expect(() => { executor.execute(new XpellaContext()); }).to.throw('"a" is undeclared');
  });
  it('Declaration correctly creates a memory value', () => {
    const parser = new XpellaParser();
    const code = 'int a = 0;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    executor.execute(context);
    expect(context.getMemoryValue('a')).to.not.be.null;
  });
  it('Declaration type is correct in memory', () => {
    const parser = new XpellaParser();
    const code = 'int a = 0;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    executor.execute(context);
    expect(context.getMemoryValue('a').value).to.equal(0);
  });
  it('Assignation correctly sets a memory value', () => {
    const parser = new XpellaParser();
    const code = 'a = 1;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    context.declareMemoryValue('a', new XpellaVariable('a', 0, XpellaTypes.int, XpellaScope.LOCAL));
    expect(context.getMemoryValue('a').value).to.equal(0);
    executor.execute(context);
    expect(context.getMemoryValue('a').value).to.equal(1);
  });
  it('Parse declaration and assignation on the same line', () => {
    const parser = new XpellaParser();
    const code = 'int a = 0; a = 1;';
    expect(parser.parse(code)).to.be.instanceOf(XpellaExecutor);
  });
  it('Declaration and assignation on the same line sets a correct memory value', () => {
    const parser = new XpellaParser();
    const code = 'int a = 0; a = 1;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    executor.execute(context);
    expect(context.getMemoryValue('a').value).to.equal(1);
  });
  it('Cannot redeclare a variable', () => {
    const parser = new XpellaParser();
    const code = 'int a = 0; int a = 1;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    expect(() => { executor.execute(context); }).to.throw('"a" is already declared');
  });
  it('Declaration identifier is correct in memory', () => {
    const parser = new XpellaParser();
    const code = 'int a = 0;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    executor.execute(context);
    expect(context.getMemoryValue('a').getIdentifier()).to.equal('a');
  });
  it('Type resolution at parse time with type "any"', () => {
    const parser = new XpellaParser();
    const code = 'any a = 0;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    executor.execute(context);
    expect(context.getMemoryValue('a').value).to.equal(0);
    expect(context.getMemoryValue('a').getType().getIdentifier()).to.equal('int');
  });
  it('Can declare a variable without value', () => {
    const parser = new XpellaParser();
    const code = 'int a;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    executor.execute(context);
    expect(context.getMemoryValue('a')).to.not.be.undefined;
  });
  it('Declared variable without value registers a null value', () => {
    const parser = new XpellaParser();
    const code = 'int a;';
    const executor = parser.parse(code);
    const context = new XpellaContext();
    executor.execute(context);
    expect(context.getMemoryValue('a').value).to.be.null;
  });
  it('Cannot declare "any" typed variable without value', () => {
    const parser = new XpellaParser();
    const code = 'any a;';
    expect(() => { parser.parse(code); }).to.throw('Cannot declare a variable typed "any" with no value');
  });
});
