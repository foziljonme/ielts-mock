import { ClsServiceManager } from 'nestjs-cls';
import { ContextEnvKeys } from './contextStorage.service';

export function tenantIdFromCls(): string {
  const cls = ClsServiceManager.getClsService();

  const tenantId = cls.get(ContextEnvKeys.TENANT_ID);
  if (!tenantId) {
    throw new Error('TENANT_ID not found in CLS context');
  }

  return tenantId;
}

export function isPlatformRequest(): boolean {
  const cls = ClsServiceManager.getClsService();

  const isPlatformRequest = cls.get(ContextEnvKeys.IS_PLATFORM_REQUEST);

  return isPlatformRequest;
}

export function isSaasAdmin(): boolean {
  const cls = ClsServiceManager.getClsService();

  const isSaasAdmin = cls.get(ContextEnvKeys.IS_OWNER);

  return isSaasAdmin;
}
