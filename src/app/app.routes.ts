import { Routes } from '@angular/router';
import { CompanyList } from './components/companies/company-list/company-list';
import { NewCompany } from './components/companies/new-company/new-company';

export const routes: Routes = [
  { path: '', component: CompanyList },
  { path: 'new-company', component: NewCompany }
];

