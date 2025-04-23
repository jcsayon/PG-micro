// utils/roleConfig.js
export const ROLES = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
  INVENTORY: 'Inventory',
  SALES: 'Sales',
  RETURNS: 'Returns',
  PURCHASE_ORDER: 'Purchase Order',
  WARRANTY_LIST: 'Warranty List'
};

export const ACCESS_CONTROL = {
  [ROLES.ADMIN]: [
    '/dashboard',
    '/inventory',
    '/sales',
    '/return-warranty',
    '/user-management',
    '/purchase-orders',
    '/reports'
  ],
  [ROLES.INVENTORY]: [
    '/dashboard',
    '/inventory'
  ],
  [ROLES.SALES]: [
    '/dashboard',
    '/sales'
  ],
  [ROLES.RETURNS]: [
    '/dashboard',
    '/return-warranty'
  ],
  [ROLES.EMPLOYEE]: [
    '/dashboard'
  ],
  [ROLES.PURCHASE_ORDER]: [
    '/dashboard',
    '/purchase-orders'
  ],
  [ROLES.WARRANTY_LIST]: [
    '/dashboard',
    '/return-warranty'
  ]
};