import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company-service';
import { Company } from '../../../models/company.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.css']
})
export class CompanyList implements OnInit {

  public companies: Company[] = [];
  public isLoading = true;
  public isError = false;
  public errorMessage = '';

  public expandedCompanyId: string | null = null;

  constructor(
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  private loadCompanies(): void {
    this.isLoading = true;
    this.isError = false;
    this.errorMessage = '';

    this.companyService.getCompanies()
      .pipe(take(1))
      .subscribe({
        next: (data: Company[]) => {
          this.companies = data ?? [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Klaida užkraunant įmones', err);
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = 'Užkraunant įrašus įvyko klaida';
          this.cdr.detectChanges();
        }
      });
  }

  public toggleContacts(id: string | undefined) {
    if (!id) {
      return;
    }

    this.expandedCompanyId = this.expandedCompanyId === id ? null : id;
  }

  public onDeleteCompany(company: Company) {
    if (!company.id) {
      return;
    }

    const confirmDelete = confirm(
      `Ar tikrai norite ištrinti įmonę "${company.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    this.isLoading = true;

    this.companyService.deleteCompany(company.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.companies = this.companies.filter(c => c.id !== company.id);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Klaida trinant įmonę', err);
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = 'Nepavyko ištrinti įmonės.';
          this.cdr.detectChanges();
        }
      });
  }
}
