import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ShippingAddressInterface {
  id?: string;
  user_id: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface ShippingAddressGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}
