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
    return this.http
      .get<{ [key: string]: Company } | null>(this.url + '.json')
      .pipe(
        map((data) => {
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

          return companies;
        }),
        tap((data) => {
          this.companies = data;
        })
      );
  }

  public addCompany(company: Company) {
    return this.http.post(this.url + '.json', company);
  }
}
