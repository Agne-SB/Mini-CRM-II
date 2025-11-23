import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CompanyService} from '../../../services/company-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-company',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-company.html',
  styleUrl: './new-company.css',
})
export class NewCompany {

  public newCompanyForm: FormGroup;

  public isLoading = false;
  public isError = false;
  public errorMessage = '';
  public successMessage = '';

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) {
    this.newCompanyForm = new FormGroup({
      'name': new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z ]*$')
      ]),
      'companyCode': new FormControl(null, [
        Validators.pattern('^[0-9]*$')
      ]),
      'vatCode': new FormControl(null, [
        Validators.pattern('^(LT)?[0-9]*$')
      ]),
      'address': new FormControl(null),
      'email': new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      'phone': new FormControl(null, [
        Validators.pattern(/^(\+370[0-9]{6,8})?$/)
      ]),
      'contacts': new FormArray([
        this.createContactGroup()
      ])
    });
  }

  get contacts() {
    return this.newCompanyForm.get('contacts') as FormArray;
  }

  private createContactGroup(): FormGroup {
    return new FormGroup({
      'firstName': new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')
      ]),
      'lastName': new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')
      ]),
      'position': new FormControl(null),
      'contactPhone': new FormControl(null, [
        Validators.pattern(/^(\+370[0-9]{6,8})?$/)
      ])
    });
  }

  public addContact(): void {
    this.contacts.push(this.createContactGroup());
  }

  public removeContact(index: number): void {
    this.contacts.removeAt(index);
  }

  public submitForm() {
    if (this.newCompanyForm.invalid) {
      this.newCompanyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.isError = false;
    this.errorMessage = '';
    this.successMessage = '';

    const companyData = this.newCompanyForm.value;

    this.companyService.addCompany(companyData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Įmonė sėkmingai išsaugota!';

        this.newCompanyForm.reset();
        this.contacts.clear();
        this.contacts.push(this.createContactGroup());

        this.successMessage = 'Įmonė sėkmingai išsaugota!';

        setTimeout(() => {
          this.router.navigate(['']);
        }, 1500);

      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = 'Įvyko klaida įrašant duomenis į serverį';
      }
    });

    console.log('Saugoti duomenis');
    console.log(this.newCompanyForm.value);
    console.log(this.newCompanyForm.valid);
  }
}
