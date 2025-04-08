export const ROLES = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
  INVENTORY: 'Inventory',
  SALES: 'Sales',
  RETURNS: 'Returns'
};

export const ACCESS_CONTROL = {
  [ROLES.ADMIN]: [
    '/dashboard',
    '/inventory',
    '/sales',
    '/return-warranty',
    '/user-management'
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
  ]
};