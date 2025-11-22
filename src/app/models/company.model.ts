import {Contact} from './contact.model';

export class Company {
  id?: string;

  public name: string | null = null;
  public companyCode: string | null = null;
  public vatCode: string | null = null;
  public address: string | null = null;
  public email: string | null = null;
  public phone: string | null = null;

  public contacts: Contact[] = [];
}
