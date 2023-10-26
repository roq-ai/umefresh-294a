interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: [],
  tenantRoles: ['Business Owner', 'Store Manager'],
  tenantName: 'Business',
  applicationName: 'umefresh',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [],
  ownerAbilities: ['Manage business', 'Manage products', 'View orders', 'View user information'],
  getQuoteUrl: 'https://app.roq.ai/proposal/e02a29f5-d543-490a-882e-fa4669256b5e',
};
