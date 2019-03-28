export function GetVariableValue (context, identifier) : any {
  return context.getMemoryValue(identifier)
}

export function AssignVariable (context, identifier, value) : any {
  return context.setMemoryValue(identifier, value)
}