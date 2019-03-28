import { expect } from 'chai';

import { XpellaLexer } from '../src/Parser/Helpers/XpellaLexer';
import { XpellaInputStream } from '../src/Parser/Helpers/XpellaInputStream';

describe('Xpella lexer', () => {
  it('isWhitespace returns true for simple whitespaces', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isWhitespace(' ')).to.be.true;
  })
  it('isWhitespace returns true for tabs', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isWhitespace('\t')).to.be.true;
  })
  it('isWhitespace returns true for new line', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isWhitespace('\n')).to.be.true;
  })
  it('isWhitespace returns true for carriage return', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isWhitespace('\r')).to.be.true;
  })
  it('isBlockDelimiter returns true for {}', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isBlockDelimiter('{')).to.be.true;
    expect(lexer.isBlockDelimiter('}')).to.be.true;
  })
  it('isBlockDelimiter returns true for ()', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isBlockDelimiter('(')).to.be.true;
    expect(lexer.isBlockDelimiter(')')).to.be.true;
  })
  it('isBlockDelimiter returns true for []', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isBlockDelimiter('[')).to.be.true;
    expect(lexer.isBlockDelimiter(']')).to.be.true;
  })
  it('isBlockDelimiter returns false for everything else', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isBlockDelimiter(' ')).to.be.false;
    expect(lexer.isBlockDelimiter('a')).to.be.false;
    expect(lexer.isBlockDelimiter('0')).to.be.false;
    expect(lexer.isBlockDelimiter('@')).to.be.false;
  })
  it('isLineDelimiter returns true for semicolon', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isLineDelimiter(';')).to.be.true;
  })
  it('isLineDelimiter returns false for everything else', () => {
    let lexer = new XpellaLexer(new XpellaInputStream(''));
    expect(lexer.isLineDelimiter('a')).to.be.false;
    expect(lexer.isLineDelimiter('0')).to.be.false;
    expect(lexer.isLineDelimiter(')')).to.be.false;
    expect(lexer.isLineDelimiter('}')).to.be.false;
  })
})