import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company-service';
import { Company } from '../../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css'
})
export class CompanyList {

  public companies: Company[] = [];
  public isLoading = false;
  public isError = false;
  public errorMessage = '';

  constructor(private companyService: CompanyService) {
    this.isLoading = true;
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = 'Užkraunant įrašus įvyko klaida';
      }
    });
  }
}
