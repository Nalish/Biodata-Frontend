import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-marriage',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './marriage.component.html',
  styleUrl: './marriage.component.css'
})
export class MarriageUpdateComponent implements OnInit {
  constructor(
    private router: Router, // Inject Router for navigation
    private marriageService: ApiService // Inject ApiService for API calls
  ) { }

  private fb = inject(FormBuilder) // Inject FormBuilder for form creation
  marriageForm = this.fb.group({ // Create a form group for the marriage form
    spouse_name: [''],
    marriage_place: [''],
    marriage_date: [''],
    marriage_no: [''],
    user_id: [''],
  })

  errorMessage = '';
  successMessage = '';
  userId: any; // Variable to store the user ID

  ngOnInit(): void { // Lifecycle hook that is called after the component has been initialized
    console.log("Fill in the marriage form");
  }

  onSubmitMarriageForm(): void {
    if (this.marriageForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    const localStorageData = localStorage.getItem('selectedChristian'); // Get the user ID from local storage
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      this.userId = parsedData?.id;

      this.marriageForm.patchValue({ user_id: this.userId }); // Assign userId from local storage to the form data

      // Check if the record already exists
      this.marriageService.getMarriageByUserId(this.userId).subscribe(
        (existingRecord: any) => {
          if (existingRecord.length > 0) {
            // If record exists, update it
            console.log("This is the fetched existing record: ", existingRecord);
            const marriageId = existingRecord[0].marriage_id;
            this.marriageService.updateMarriage(marriageId, this.marriageForm.value).subscribe(
              (response) => {
                console.log('Marriage information updated successfully:', response); // Log the successful update response
                this.successMessage = 'Marriage Information updated successfully!'; // Set success message
                this.navigateToDashboard(); // Navigate to the next page after a delay
              },
              (error: any) => {
                console.error('Error updating marriage information:', error); // Log any error
                this.errorMessage = 'Failed to update marriage information. Please try again.';
              }
            );
          } else {
            // If record does not exist, create a new one
            this.marriageService.createMarriage(this.marriageForm.value).subscribe(
              (response) => {
                console.log('Marriage information added successfully:', response); // Log the successful creation response
                this.successMessage = 'Marriage Information added successfully!'; // Set success message
                localStorage.removeItem('selectedChristian'); // Remove the item from local storage
                this.navigateToDashboard(); // Navigate to the next page after a delay
              },
              (error) => {
                console.error('Error adding marriage information:', error); // Log any error
                this.errorMessage = 'Failed to add marriage information. Fill in all the fields to continue...';
              }
            );
          }
        },
        (error: any) => {
          console.error('Error checking existing marriage record:', error); // Log any error
          this.errorMessage = 'Failed to check existing marriage record. Please try again.';
        }
      );
    }
  }

  navigateToDashboard() {
    setTimeout(() => {
      this.router.navigate(['/dashboard']); // Navigate to the dashboard page
    }, 5000); // Delay of 1 second before navigation
  }

  navigateTOConfirmation() {
    setTimeout(() => {
      this.router.navigate(['/edit-confirmation']); // Navigate to the confirmation page
    }, 1000); // Delay of 1 second before navigation
  }
}
