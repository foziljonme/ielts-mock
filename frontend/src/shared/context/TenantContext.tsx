import { createContext, useMemo, type ReactNode } from "react";

export function resolveTenant() {
  const host = window.location.hostname;

  // localhost handling
  if (host === "localhost" || host === "127.0.0.1") {
    return {
      tenant: null,
      isSaas: true,
    };
  }

  const parts = host.split(".");

  // saas.example.com
  if (parts.length === 3 && parts[0] === "saas") {
    return {
      tenant: null,
      isSaas: true,
    };
  }

  // school-a.example.com
  if (parts.length >= 3) {
    return {
      tenant: parts[0],
      isSaas: false,
    };
  }

  return { tenant: null, isSaas: true };
}

const TenantContext = createContext<{
  tenant: string | null;
  isSaas: boolean;
}>({ tenant: null, isSaas: false });

export function TenantProvider({ children }: { children: ReactNode }) {
  const tenantInfo = useMemo(() => resolveTenant(), []);

  return (
    <TenantContext.Provider value={tenantInfo}>
      {children}
    </TenantContext.Provider>
  );
}
