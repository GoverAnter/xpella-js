export class MessagePackExtensions {
  types: Object = {};

  constructor () {}

  addPackInfos (type: number, jsType: any, conversionMethod: Function) {
    let strType = '' + type;
    if (!this.types[strType]) {
      this.types[strType] = {};
    }

    this.types[strType].type = type;
    this.types[strType].jsType = jsType;
    this.types[strType].toBinary = conversionMethod;
    this.types[strType].packInfos = true;
  }

  addUnpackInfos (type: number, conversionMethod: Function) {
    let strType = '' + type;
    if (!this.types[strType]) {
      this.types[strType] = {};
    }

    this.types[strType].type = type;
    this.types[strType].fromBinary = conversionMethod;
    this.types[strType].unpackInfos = true;
  }

  hasPackInfosFor (type: string) : boolean {
    return this.types[type] && this.types[type].packInfos;
  }
  hasUnpackInfosFor (type: string) : boolean {
    return this.types[type] && this.types[type].unpackInfos;
  }
}