import { Router } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { auth, AuthRequest } from '../middlewares/auth';
import { validate } from '../lib/api/validate';
import { paginationSchema } from '../validators/pagination.schema';
import tenantsService from '../services/tenants.service';
import { createTenantSchema } from '../validators/tenant.schema';
import { PaginatedResponse } from '../types/pagination';
import { UserRole } from '../../prisma/generated/client';

const router = Router();

router.post('/', auth({ roles: [UserRole.PLATFORM_ADMIN] }), asyncHandler(async (req: AuthRequest, res) => {
    const tenantPayload = validate(createTenantSchema, req.body);
    const tenant = await tenantsService.createTenant(tenantPayload);
    res.status(200).json(tenant);
}));

router.get('/', auth({ roles: [UserRole.PLATFORM_ADMIN] }), asyncHandler(async (req: AuthRequest, res) => {
    const { page, pageSize } = validate(paginationSchema, req.query);
    const { items, totalItems } = await tenantsService.getTenants(
        page,
        pageSize,
    );

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
}));

router.post('/:tenantId/activate', auth({ roles: [UserRole.PLATFORM_ADMIN] }), asyncHandler(async (req: AuthRequest, res) => {
    const { tenantId } = req.params;
    const tenant = await tenantsService.activateTenant(tenantId);
    res.status(200).json(tenant);
}));

router.post('/:tenantId/deactivate', auth({ roles: [UserRole.PLATFORM_ADMIN] }), asyncHandler(async (req: AuthRequest, res) => {
    const { tenantId } = req.params;
    const tenant = await tenantsService.deactivateTenant(tenantId);
    res.status(200).json(tenant);
}));

export default router;
