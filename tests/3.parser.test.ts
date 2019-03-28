import { expect } from 'chai';
import { XpellaParser } from '../src/Parser/XpellaParser';
import { XpellaParserOptions } from '../src/Parser/XpellaParserOptions';
import { LogLevel } from '../src/Logger';

import { createCodec, encode, decode } from 'msgpack-lite';
import { registerCodecTypes } from '../src/AST/RegisterCodecTypes';

describe('Xpella parser', () => {
  it('Successful object creation', () => {
    const parser = new XpellaParser('', new XpellaParserOptions(LogLevel.INFO));
    expect(parser).to.be.instanceOf(XpellaParser);
  })
  it('Parse simple int literal expression', () => {
    const parser = new XpellaParser('1 + 2', new XpellaParserOptions(LogLevel.INFO));
    let expression = parser.solveExpression(parser.parseNextExpression());
  })
  it('Parse simple string literal expression', () => {
    const parser = new XpellaParser('"test" + "nop"', new XpellaParserOptions(LogLevel.INFO));
    let expression = parser.solveExpression(parser.parseNextExpression());
  })
  it('Parse complex int literal expression', () => {
    const parser = new XpellaParser('1 + 2 * 3 - 4', new XpellaParserOptions(LogLevel.INFO));
    let expression = parser.solveExpression(parser.parseNextExpression());
  })
  it('Verify operator precedence', () => {
    let parser = new XpellaParser('1 + 2 * 3 - 4', new XpellaParserOptions(LogLevel.INFO));
    let expression = parser.solveExpression(parser.parseNextExpression());
    parser = new XpellaParser('2 * 3 - 4', new XpellaParserOptions(LogLevel.INFO));
    expression = parser.solveExpression(parser.parseNextExpression());
    parser = new XpellaParser('1 + 2 * 3', new XpellaParserOptions(LogLevel.INFO));
    expression = parser.solveExpression(parser.parseNextExpression());
  })
  it('Parse int declaration without assignation', () => {
    const parser = new XpellaParser('int i;', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Parse int declaration with assignation', () => {
    const parser = new XpellaParser('int i = 12;', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Parse string declaration without assignation', () => {
    const parser = new XpellaParser('string s;', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Parse string declaration with assignation', () => {
    const parser = new XpellaParser('string s = "This is a test";', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Parse int declaration with complex assignation', () => {
    const parser = new XpellaParser('int i = 12 * 3 + 2;', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Parse string declaration with complex assignation', () => {
    const parser = new XpellaParser('string s = "This is a test -" + " Another string";', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Parse if statement with simple expression', () => {
    const parser = new XpellaParser('if (true) int i = 0; else int z = 0;', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Parse if statement with block statement', () => {
    const parser = new XpellaParser('if (true) { int i = 0; int q = 0; } else { int z = 0; }', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Variable declaration then assignment', () => {
    const parser = new XpellaParser('{ int i = 0; i = 1; }', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Variable declaration then assignment on different scope', () => {
    const parser = new XpellaParser('{ int i = 0; { i = 1; } }', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Variable declaration then assignment on different scope with if', () => {
    const parser = new XpellaParser('{ int i = 0; if (true) { i = 10; } i = 9; }', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
  })
  it('Variable declaration and assignation with complex expression', () => {
    const parser = new XpellaParser('{ int i = 3; int z = 5; int t = i-- % 3 * z / ++z - 5; }', new XpellaParserOptions(LogLevel.INFO));
    let statement = parser.parseStatement();
    let codec = createCodec();
    registerCodecTypes(codec);

    let encoded = encode(statement, {codec: codec});
    let decoded = decode(encoded, {codec: codec});
  })
})