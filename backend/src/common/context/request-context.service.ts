import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  user?: {
    id: string;
    role: string;
  };
  tenantId?: string;
  isAuthenticated?: boolean;
}

export class RequestContextService {
  private readonly als = new AsyncLocalStorage<RequestContext>();

  run(context: RequestContext, callback: () => void) {
    this.als.run(context, callback);
  }

  get(): RequestContext {
    return this.als.getStore() ?? {};
  }

  set<K extends keyof RequestContext>(key: K, value: RequestContext[K]) {
    const store = this.als.getStore();
    if (store) store[key] = value;
  }
}
