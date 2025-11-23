import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private url =
    'https://mini-crm-c5b77-default-rtdb.europe-west1.firebasedatabase.app/companies';

  public companies: Company[] = [];

  constructor(private http: HttpClient) {}

  public getCompanies() {
    console.log('[Service] getCompanies kviečiamas');

    return this.http
      .get<{ [key: string]: Company } | null>(this.url + '.json')
      .pipe(
        map((data) => {
          console.log('[Service] HTTP atsakymas iš Firebase:', data);

          const companies: Company[] = [];

          if (!data) {
            return companies;
          }

          for (let k in data) {
            if (data.hasOwnProperty(k)) {
              data[k].id = k;
              companies.push(data[k]);
            }
          }

          console.log('[Service] Suformuotas companies masyvas:', companies);
          return companies;
        }),
        tap((data) => {
          console.log('[Service] tap – priskiriu this.companies', data);
          this.companies = data;
        })
      );
  }

  public addCompany(company: Company) {
    return this.http.post(this.url + '.json', company);
  }

  public deleteCompany(id: string) {
    return this.http.delete(this.url + '/' + id + '.json');
  }

}
