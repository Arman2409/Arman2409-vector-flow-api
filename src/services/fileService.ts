import { promises as fs } from "fs";
import path from "path";
import { VECTORS_JSON_FILE_PATH } from "../configs/services";

export interface FileService {
  readJson<T>(): Promise<T[]>;
  appendJson<T>(items: T[]): Promise<void>;
  writeJson<T>(items: T[]): Promise<void>;
}

export class FileService {
  private static instance: FileService;
  private filePath: string;

  private constructor(filePath: string) {
    this.filePath = path.resolve(filePath);
    fs.access(this.filePath).catch(() => {
      fs.mkdir(path.dirname(this.filePath), { recursive: true });
      fs.writeFile(this.filePath, JSON.stringify([]), "utf-8");
    });
  }

  public static getInstance(filePath: string) {
    if (!FileService.instance) {
      FileService.instance = new FileService(filePath);
    }
    return FileService.instance;
  }

  /** Read JSON array from file */
  public async readJson<T>(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data) as T[];
    } catch {
      return [];
    }
  }

  /** Append items to JSON file */
  public async appendJson<T>(items: T[]): Promise<void> {
    const existing = await this.readJson<T>();
    const all = [...existing, ...items];
    await fs.writeFile(this.filePath, JSON.stringify(all, null, 2), "utf-8");
  }

  /** Overwrite JSON file completely */
  public async writeJson<T>(items: T[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), "utf-8");
  }
}

export default FileService.getInstance(VECTORS_JSON_FILE_PATH);