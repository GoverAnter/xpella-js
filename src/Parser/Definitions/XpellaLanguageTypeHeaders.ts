import { XpellaParserTypeHeader } from '../Header/XpellaParserTypeHeader';
import { XpellaParserFunctionHeader } from '../Header/XpellaParserFunctionHeader';

const XpellaLanguageTypeHeaders: XpellaParserTypeHeader[] = [
  new XpellaParserTypeHeader('int', [], [
    new XpellaParserFunctionHeader('int', 'int', [], 'public', []),
    new XpellaParserFunctionHeader('int', 'int', [{ type: 'int', hasDefault: false }], 'public', [])
  ],                         {
    '+': { int: true },
    '-': { int: true },
    '/': { int: true },
    '*': { int: true },
    '%': { int: true },
    '++': { back: true, front: true },
    '--': { back: true, front: true },
    '=': { boolean: true, int: true }
  }),
  new XpellaParserTypeHeader('string', [], [
    new XpellaParserFunctionHeader('string', 'string', [], 'public', []),
    new XpellaParserFunctionHeader('string', 'string', [{ type: 'string', hasDefault: false }], 'public', [])
  ],                         {
    '+': { string: true, int: true, float: true, boolean: true },
    '=': { boolean: true, int: true, string: true }
  }),
  new XpellaParserTypeHeader('boolean', [], [
    new XpellaParserFunctionHeader('boolean', 'boolean', [], 'public', []),
    new XpellaParserFunctionHeader('boolean', 'boolean', [{ type: 'boolean', hasDefault: false }], 'public', [])
  ],                         {
    '==': { boolean: true },
    '!=': { boolean: true },
    '&&': { boolean: true },
    '||': { boolean: true },
    '>': { boolean: true },
    '<': { boolean: true },
    '>=': { boolean: true },
    '<=': { boolean: true },
    '!': { back: true },
    '=': { boolean: true, int: true }
  })
];

export { XpellaLanguageTypeHeaders };
