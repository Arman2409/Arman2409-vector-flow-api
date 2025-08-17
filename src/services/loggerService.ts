import chalk from 'chalk';

import type { RequestWithContext } from '../types/shared/requests';

// Update the interface to include the optional request object in all methods.
interface LoggerService {
  info(message: string, req?: RequestWithContext): void;
  error(message: string, err?: Error | unknown, req?: RequestWithContext): void;
  warn(message: string, req?: RequestWithContext): void;
  debug(message: string, req?: RequestWithContext): void;
}

class LoggerService {
  private static instance: LoggerService;

  private getTimestamp() {
    return new Date().toISOString().slice(0, -5);
  }

  private getRequestId(req?: RequestWithContext<unknown>): string {
    return req?.id ? `[Request ID: ${req.id}]` : '';
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public info(message: string, req?: RequestWithContext<unknown>) {
    const requestId = this.getRequestId(req);
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.green('INFO')} ${requestId}: ${message}`;
    console.log(log);
  }

  public error(
    message: string,
    err?: Error | unknown,
    req?: RequestWithContext<unknown>
  ) {
    const requestId = this.getRequestId(req);
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.redBright('ERROR')} ${requestId}: ${message}, error:`;
    console.log(log, err);
  }

  public warn(message: string, req?: RequestWithContext) {
    const requestId = this.getRequestId(req);
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.yellowBright('WARN')} ${requestId}: ${message}`;
    console.log(log);
  }

  public debug(message: string, req?: RequestWithContext) {
    const requestId = this.getRequestId(req);
    const log = `[${chalk.gray(this.getTimestamp())}] ${chalk.cyanBright('DEBUG')} ${requestId}: ${message}`;
    console.log(log);
  }
}

export default LoggerService.getInstance();