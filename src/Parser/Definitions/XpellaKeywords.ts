export const XpellaParserConstructs = [
  'if',
  'else',
  'for',
  'do',
  'while',
  'switch',
  'try',
  'catch',
  'finally'
];

export const XpellaParserModifiers = [
  'static',
  'const'
];

export const XpellaParserVisibilities = [
  'public',
  'protected',
  'private'
];

export const XpellaParserDefaultVisibility = 'protected';

export const XpellaParserExpressionKeywords = [
  'instanceof', // True if left is of type right
  // [expression] instanceof [type]
  'typeof' // Gives the type object
  // typeof [expression]
];

export const XpellaParserStatementKeywords = [
  'return', // Indicates the function output
  // return [expression]?;
  'break', // Get out of a loop
  // break;
  'continue' // Do next loop iteration
  // continue;
];

export const XpellaParserTypes = [
  'any', // Any is special because it is only a syntaxic construction
  'function',
  'type',
  'object',
  'int',
  'string',
  'float',
  'boolean',
  'bool' // Same as boolean, only a syntaxic construction
];

export const XpellaParserThisKeyword = 'this';
export const XpellaParserTypeDeclarationKeyword = 'class';
export const XpellaParserTypeInstantiationKeyword = 'new';
export const XpellaParserOperatorFunctionPrefix = 'operator';

export const XpellaParserObjectAccessor = '.';
export const XpellaParserLineDelimiter = ';';

// Comments
// Only a helper object to expose a clean interface
export const XpellaParserComments = {
  XpellaParserSingleLineComment: '//',

  XpellaParserMultiLineStartComment: '/*',
  XpellaParserMultiLineEndComment: '*/',

  XpellaParserMultiLineStartDocumentation: '/**',
  XpellaParserMultiLineEndDocumentation: '*/'
};

// A string termination delimiter MUST match its start delimiter
export const XpellaParserStringDelimiters = [
  '\'',
  '"',
  '`',
];

// The char to escape a string delimiter
export const XpellaParserStringEscape = '\\';

// Statement operators always have the lowest precedence
export const XpellaParserStatementOperators = [
  '=',
  '+=',
  '-=',
  '*=',
  '/=',
  '%='
];

export const XpellaParserExpressionOperators: { [operator: string]: number } = {
  '==': 10, // Equality
  '!=': 10, // Inequality
  '>=': 15, // More than or equal
  '<=': 15, // Less than or equal
  '<': 15, // Less than
  '>': 15, // More than
  '?': 2, // Ternary condition
  ':': 2, // Ternary condition execution
  '&&': 4, // Boolean and
  '||': 3, // Boolean or
  '>>': 17, // Binary right shift
  '<<': 17, // Binary left shift
  '&': 8, // Binary and
  '|': 6, // Binary or
  '^': 7, // Binary xor
  '+': 20, // Plus
  '-': 20, // Minus
  '*': 30, // Times
  '/': 30, // Divided by
  '%': 30 // Remaining
};

export const XpellaParserExpressionOperatorsArray = [
  '==', // Equality
  '!=', // Inequality
  '>=', // More than or equal
  '<=', // Less than or equal
  '<', // Less than
  '>', // More than
  '?', // Ternary condition
  ':', // Ternary condition execution
  '&&', // Boolean and
  '||', // Boolean or
  '>>', // Binary right shift
  '<<', // Binary left shift
  '&', // Binary and
  '|', // Binary or
  '^', // Binary xor
  '+', // Plus
  '-', // Minus
  '*', // Times
  '/', // Divided by
  '%' // Remaining
];

// Back operators are always prioritized
export const XpellaParserBackOperators = [
  '++', // Can also be front operators with the same priority
  '--',
  '!', // Boolean not
  '~' // Binary not
];
// Front operators are always prioritized
export const XpellaParserFrontOperators = [
  '++', // Can also be back operators with the same priority
  '--'
];
