import chalk from 'chalk';

interface LoggerService {
  info(message: string): void;
  error(message: string, err?: Error | unknown): void;
  warn(message: string): void;
  debug(message: string): void;
}

class LoggerService {
  private getTimestamp() {
    return new Date().toISOString();
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

export default new LoggerService();