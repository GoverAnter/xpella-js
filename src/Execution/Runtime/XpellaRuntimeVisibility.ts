export enum XpellaRuntimeVisibility {
  PUBLIC,
  PROTECTED,
  PRIVATE
}

export function parserVisibilityToRuntimeVisibility(visibility: string): XpellaRuntimeVisibility {
  if (visibility === 'public') {
    return XpellaRuntimeVisibility.PUBLIC;
  } else if (visibility === 'private') {
    return XpellaRuntimeVisibility.PRIVATE;
  } else {
    return XpellaRuntimeVisibility.PROTECTED;
  }
}
