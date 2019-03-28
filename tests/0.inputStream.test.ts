import { expect } from 'chai';

import { XpellaInputStream } from '../src/Parser/Helpers/XpellaInputStream';

describe('Xpella input stream', () => {
  it('Successful input stream creation', () => {
    const inputStream = new XpellaInputStream('');
    expect(inputStream).to.be.instanceOf(XpellaInputStream);
  })
  it('Parameter initialization is correct', () => {
    const inputStream = new XpellaInputStream('');
    expect(inputStream.getCurrentColumn()).to.equal(0);
    expect(inputStream.getCurrentLine()).to.equal(1);
  })
  it('Next returns the next char', () => {
    const inputStream = new XpellaInputStream('a');
    expect(inputStream.next()).to.equal('a');
  })
  it('Next (without new line) increments current column', () => {
    const inputStream = new XpellaInputStream('a');
    inputStream.next();
    expect(inputStream.getCurrentColumn()).to.equal(1);
  })
  it('Next (without new line) does not increment current line', () => {
    const inputStream = new XpellaInputStream('a');
    inputStream.next();
    expect(inputStream.getCurrentLine()).to.equal(1);
  })
  it('Next (with new line) resets current column', () => {
    const inputStream = new XpellaInputStream('a\n');
    inputStream.next();
    expect(inputStream.getCurrentColumn()).to.equal(1);
    inputStream.next();
    expect(inputStream.getCurrentColumn()).to.equal(0);
  })
  it('Next (with new line) increments current line', () => {
    const inputStream = new XpellaInputStream('a\n');
    inputStream.next();
    expect(inputStream.getCurrentLine()).to.equal(1);
    inputStream.next();
    expect(inputStream.getCurrentLine()).to.equal(2);
  })
  it('Throw uses good line/column number', () => {
    const inputStream = new XpellaInputStream('a\naa');
    inputStream.next();
    inputStream.next();
    inputStream.next();
    inputStream.next();
    expect(inputStream.getCurrentLine()).to.equal(2);
    expect(inputStream.getCurrentColumn()).to.equal(2);
    expect(() => { inputStream.throw('message'); }).to.throw('message (line 2, col 2)');
  })
  it('Eof is working with empty string', () => {
    const inputStream = new XpellaInputStream('');
    expect(inputStream.isEof()).to.be.true;
  })
  it('Eof is working with non empty string', () => {
    const inputStream = new XpellaInputStream('a');
    expect(inputStream.isEof()).to.be.false;
    inputStream.next();
    expect(inputStream.isEof()).to.be.true;
  })
  it('Next returns undefined when eof is reached', () => {
    const inputStream = new XpellaInputStream('');
    expect(inputStream.isEof()).to.be.true;
    expect(inputStream.next()).to.be.undefined;
  })
  it('Next does not increment anything when eof is reached', () => {
    const inputStream = new XpellaInputStream('');
    expect(inputStream.isEof()).to.be.true;
    inputStream.next()
    expect(inputStream.getCurrentColumn()).to.equal(0);
    expect(inputStream.getCurrentLine()).to.equal(1);
  })
  it('Peek returns the next char', () => {
    const inputStream = new XpellaInputStream('a');
    expect(inputStream.peek()).to.equal('a');
  })
  it('Peek (without new line) does not increment anything', () => {
    const inputStream = new XpellaInputStream('a');
    inputStream.peek()
    expect(inputStream.getCurrentColumn()).to.equal(0);
    expect(inputStream.getCurrentLine()).to.equal(1);
  })
  it('Peek (with new line) does not increment anything', () => {
    const inputStream = new XpellaInputStream('\n');
    inputStream.peek()
    expect(inputStream.getCurrentColumn()).to.equal(0);
    expect(inputStream.getCurrentLine()).to.equal(1);
  })
  it('Peek returns undefined when eof is reached', () => {
    const inputStream = new XpellaInputStream('');
    expect(inputStream.isEof()).to.be.true;
    expect(inputStream.peek()).to.be.undefined;
  })
})