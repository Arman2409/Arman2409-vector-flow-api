import chalk from 'chalk';

interface Logger {
  info(message: string): void;
  error(message: string, err?: Error | unknown): void;
  warn(message: string): void;
  debug(message: string): void;
}

class Logger {
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
    const errorDetails = err ? `${message}, Error: ${(err as Error).message}` : message;

    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.redBright('ERROR')}: ${errorDetails}`;
    console.log(log);
  }

  public warn(message: string) {
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.yellowBright('WARN')}: ${message}`;
    console.log(log);
  }

  public debug(message: string) {
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.cyanBright('DEBUG')}: ${message}`;
    console.log(log);
  }
}

export default new Logger();