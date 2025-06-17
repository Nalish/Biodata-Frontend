import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-marriage',
  imports: [ReactiveFormsModule],
  templateUrl: './marriage.component.html',
  styleUrl: './marriage.component.css'
})
export class MarriageUpdateComponent implements OnInit {
  constructor(
    private router: Router,
    private marriageService: ApiService
  ) { }

  private fb = inject(FormBuilder)
  marriageForm = this.fb.group({
    marriage_certificate_no: [''],
    entry_no: [''],
    county: [''],
    subcounty: [''],
    place_of_marriage: [''],
    marriage_date: [''],
    first_name_groom: [''],
    last_name_groom: [''],
    age_groom: [''],
    occupation_groom: [''],
    residence_groom: [''],
    first_name_bride: [''],
    last_name_bride: [''],
    age_bride: [''],
    occupation_bride: [''],
    residence_bride: [''],
    first_name_witness1: [''],
    last_name_witness1: [''],
    first_name_witness2: [''],
    last_name_witness2: [''],
    registrar: [''],
    ref_number: [''],
    user_id: ['']
  })

  errorMessage = '';
  successMessage = '';
  userId: any;
  selectedFile: File | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    console.log("Fill in the marriage form");

    // Check if user is logged in
    const user = localStorage.getItem('userLoggedIn');
    if (!user) {
      setTimeout(() => {
        if (confirm('You are not logged in. Do you want to go to the login page?')) {
          this.router.navigate(['/login']);
        }
      }, 3000);
      return;
    }

    // Check if form data exists in session storage
    const storedFormData = sessionStorage.getItem('christianFormData');
    if (storedFormData) {
      const formData = JSON.parse(storedFormData);
      this.marriageForm.patchValue(formData);
    }
  }

  onSubmitMarriageForm(): void {
    if (this.marriageForm.untouched) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    
    if (this.marriageForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const localStorageData = localStorage.getItem('selectedChristian');
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      this.userId = parsedData?.user_id;

      this.marriageForm.patchValue({ user_id: this.userId });

      // Check if the record already exists
      this.marriageService.getMarriageByUserId(this.userId).subscribe({
        next: (existingRecord: any) => {
          if (existingRecord.length > 0) {
            // Update existing record
            this.updateMarriageRecord(existingRecord[0].marriage_id);
          } else {
            // Create new record
            this.createMarriageRecord();
          }
        },
        error: (error: any) => {
          console.error('Error checking existing marriage record:', error);
          this.errorMessage = 'Failed to check existing marriage record. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }

  private createMarriageRecord(): void {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(this.marriageForm.value).forEach(key => {
      const value = this.marriageForm.value[key as keyof typeof this.marriageForm.value];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Add file if selected
    if (this.selectedFile) {
      formData.append('marriage_certificate', this.selectedFile);
    }

    this.marriageService.createMarriage(formData).subscribe({
      next: (response) => {
        console.log('Marriage information added successfully:', response);
        this.successMessage = 'Marriage Information added successfully!';
        localStorage.removeItem('selectedChristian');
        this.navigateToDashboard();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error adding marriage information:', error);
        this.errorMessage = 'Failed to add marriage information. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  private updateMarriageRecord(marriageId: any): void {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(this.marriageForm.value).forEach(key => {
      const value = this.marriageForm.value[key as keyof typeof this.marriageForm.value];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Add file if selected
    if (this.selectedFile) {
      formData.append('marriage_certificate', this.selectedFile);
    }

    this.marriageService.updateMarriage(marriageId, formData).subscribe({
      next: (response) => {
        console.log('Marriage information updated successfully:', response);
        this.successMessage = 'Marriage Information updated successfully!';
        this.navigateToDashboard();
        this.isSubmitting = false;
      },
      error: (error: any) => {
        console.error('Error updating marriage information:', error);
        this.errorMessage = 'Failed to update marriage information. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  navigateToDashboard() {
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  navigateToConfirmation() {
    setTimeout(() => {
      this.router.navigate(['/edit-confirmation']);
    }, 1000);
  }

  // Simplified file handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please select a valid file type (JPEG, PNG, or PDF).';
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.errorMessage = 'File size must be less than 5MB.';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    const fileInput = document.getElementById('file_upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getFileName(): string {
    return this.selectedFile ? this.selectedFile.name : '';
  }

  getFileSize(): string {
    if (!this.selectedFile) return '';
    const size = this.selectedFile.size;
    if (size < 1024) {
      return size + ' bytes';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }

  // Helper methods remain the same
  hasFieldError(fieldName: string): boolean {
    const field = this.marriageForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.marriageForm.get(fieldName);
    if(field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required.`;
      }
      if (field.errors['pattern']) {
        return `${this.getFieldLabel(fieldName)} must be a valid number.`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'marriage_certificate_no': 'Marriage Certificate Number',
      'entry_no': 'Entry Number',
      'county': 'County',
      'subcounty': 'Sub County',
      'place_of_marriage': 'Place of Marriage',
      'marriage_date': 'Marriage Date',
      'first_name_groom': 'Groom First Name',
      'last_name_groom': 'Groom Last Name',
      'age_groom': 'Groom Age',
      'occupation_groom': 'Groom Occupation',
      'residence_groom': 'Groom Residence',
      'first_name_bride': 'Bride First Name',
      'last_name_bride': 'Bride Last Name',
      'age_bride': 'Bride Age',
      'occupation_bride': 'Bride Occupation',
      'residence_bride': 'Bride Residence',
      'first_name_witness1': 'First Witness First Name',
      'last_name_witness1': 'First Witness Last Name',
      'first_name_witness2': 'Second Witness First Name',
      'last_name_witness2': 'Second Witness Last Name',
      'registrar': 'Registrar',
      'ref_number': 'Reference Number'
    };
    return labels[fieldName] || fieldName;
  }
}