import chalk from 'chalk';

class LoggerService {
  private static instance: LoggerService;

  private getTimestamp() {
    return new Date().toISOString().slice(0, -5);
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public info(message: string) {
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.green('INFO')}: ${message}`;
    console.log(log);
  }

  public error(
    message: string,
    err?: Error | unknown
  ) {
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.redBright('ERROR')}: ${message}, error:`;
    console.log(log, err);
  }

  public warn(message: string) {
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.yellowBright('WARN')}: ${message}:`;
    console.log(log);
  }

  public debug(message: string) {
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.cyanBright('DEBUG')}: ${message}`;
    console.log(log);
  }
}

export default LoggerService.getInstance();