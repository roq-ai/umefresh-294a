import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BillingInformationInterface {
  id?: string;
  user_id: string;
  card_number: string;
  card_name: string;
  expiration_date: any;
  cvv: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface BillingInformationGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  card_number?: string;
  card_name?: string;
}
