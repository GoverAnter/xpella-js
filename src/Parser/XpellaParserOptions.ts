import { LogLevel } from '../Logger';

export class XpellaParserOptions {
  private logLevel: LogLevel;
  private checkTypes: boolean;
  private outputWarnings: boolean;
  private generateDocumentation: boolean;
  private generateComments: boolean;

  constructor(logLevel: LogLevel = LogLevel.INFO,
              checkTypes: boolean = true,
              generateDocumentation: boolean = true,
              outputWarnings: boolean = true,
              generateComments: boolean = false) {
    this.logLevel = logLevel;
    this.checkTypes = checkTypes;
    this.outputWarnings = outputWarnings;
    this.generateDocumentation = generateDocumentation;
    this.generateComments = generateComments;
  }

  public getLogLevel(): LogLevel { return this.logLevel; }
  public shouldCheckTypes(): boolean { return this.checkTypes; }
  public shouldOutputWarnings(): boolean { return this.outputWarnings; }
  public shouldGenerateDocumentation(): boolean { return this.generateDocumentation; }
  public shouldGenerateComments(): boolean { return this.generateComments; }
}
