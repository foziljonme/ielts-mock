import { Injectable } from '@nestjs/common';
import { CLS_ID, ClsService } from 'nestjs-cls';

interface IContextStorageService {
  setContextId(id: string): void;
  getContextId(): string;
  // getContextEnv<T>(key: ContextEnvKeys): T | undefined;
  // setContextEnv<T>(key: ContextEnvKeys, value: T): void;
}

export enum ContextEnvKeys {
  TENANT_ID = 'TENANT_ID',
  SUBDOMAIN = 'SUBDOMAIN',
  AUTH_TOKEN = 'AUTH_TOKEN',
  ROLE = 'ROLE',
  PERMISSIONS = 'PERMISSIONS',
  IS_PLATFORM_REQUEST = 'IS_PLATFORM_REQUEST',
  IS_OWNER = 'IS_OWNER',
}

@Injectable()
export class ContextStorageService implements IContextStorageService {
  constructor(private readonly cls: ClsService) {}

  // Set context id
  public setContextId(id: string): void {
    this.cls.set(CLS_ID, id);
  }

  // Get context id
  public getContextId(): string {
    return this.cls.get(CLS_ID);
  }

  public setContextEnv<T>(key: ContextEnvKeys, value: T): void {
    this.cls.set(key, value);
  }

  /**
   * Get the value of a **required** context environment variable from request-scoped storage,
   * @param key The key of the context environment variable
   * @returns The value of the context environment variable
   * @throws Error if the context environment variable is not found
   */
  public getContextEnv<T>(key: ContextEnvKeys): T {
    const value = this.cls.get(key);
    if (!value) {
      throw new Error(
        `Context environment variable ${key} not found in context ${this.getContextId()}`,
      );
    }

    return value;
  }

  /**
   * Get the value of a **optional** context environment variable from request-scoped storage,
   * @param key The key of the context environment variable
   * @returns The value of the context environment variable or undefined
   */
  public getContextEnvOptional<T>(key: ContextEnvKeys, defaultValue?: T): T {
    const value = this.cls.get(key);

    if (!value) {
      return defaultValue as T;
    }

    return value as T;
  }

  public get tenantId(): string {
    return this.getContextEnvOptional(ContextEnvKeys.TENANT_ID, '');
  }

  public get isPlatformRequest(): boolean {
    return this.getContextEnvOptional<boolean>(
      ContextEnvKeys.IS_PLATFORM_REQUEST,
      false,
    );
  }
}

export const ContextStorageServiceKey = Symbol('ContextStorageServiceKey');
