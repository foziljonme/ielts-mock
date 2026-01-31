import { validate } from "@/lib/api/validate";
import { asyncHandler } from "@/lib/utils/asyncHandler";
import { AuthRequest } from "@/middlewares/auth";
import tenantsService from "@/services/tenants.service";
import { paginationSchema } from "@/validators/pagination.schema";
import { createTenantSchema } from "@/validators/tenant.schema";
import { PaginatedResponse } from "@/types/pagination";

export const createTenant = asyncHandler(async (req: AuthRequest, res) => {
  const tenantPayload = validate(createTenantSchema, req.body);
  const tenant = await tenantsService.createTenant(tenantPayload);
  res.status(200).json(tenant);
});

export const listTenants = asyncHandler(async (req: AuthRequest, res) => {
  const { page, pageSize } = validate(paginationSchema, req.query);
  const { items, totalItems } = await tenantsService.getTenants(page, pageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const response: PaginatedResponse<(typeof items)[number]> = {
    results: items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };

  res.status(200).json(response);
});

export const activateTenant = asyncHandler(async (req: AuthRequest, res) => {
  const { tenantId } = req.params as { tenantId: string };
  const tenant = await tenantsService.activateTenant(tenantId);
  res.status(200).json(tenant);
});

export const deactivateTenant = asyncHandler(async (req: AuthRequest, res) => {
  const { tenantId } = req.params as { tenantId: string };
  const tenant = await tenantsService.deactivateTenant(tenantId);
  res.status(200).json(tenant);
});
