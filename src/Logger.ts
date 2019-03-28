export class Logger {
  private systemConsole: boolean = false;

  private logDebug: boolean = false;
  private logInfo: boolean = true;
  private logWarn: boolean = true;
  private logError: boolean = true;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    if (typeof window === 'undefined') {
      this.systemConsole = true; // We may be in node env
    }
    this.setLogLevel(logLevel);
  }

  public setLogLevel(logLevel: LogLevel) {
    this.logDebug = logLevel === 0;
    this.logInfo = logLevel <= LogLevel.INFO;
    this.logWarn = logLevel <= LogLevel.WARN;
    this.logError = logLevel <= LogLevel.ERROR;
  }

  public group(): void {
    if (this.logDebug) {
      console.group();
    }
  }
  public groupEnd(): void {
    if (this.logDebug) {
      console.groupEnd();
    }
  }

  public debug(message: string) {
    if (this.logDebug) { // Faint yellow
      console.log('\x1b[2m\x1b[33m' + message + '\x1b[0m');
    }
  }
  public info(message: any) {
    if (this.logInfo) {
      console.info(message);
    }
  }
  public warn(message: any) {
    if (this.logWarn) {
      console.warn(message);
    }
  }
  public error(message: any) {
    if (this.logError) {
      console.error(message);
    }
  }
}

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  NONE
}
