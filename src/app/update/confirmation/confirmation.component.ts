import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationUpdateComponent {
  constructor(
    private router: Router, // Inject Router for navigation
    private confirmationService: ApiService // Inject ApiService for API calls
  ) { } // Constructor for the component
  private fb = inject(FormBuilder) // Inject FormBuilder for form creation

  confirmationForm = this.fb.group({ // Create a form group for the confirmation form
    confirmation_place: [''],
    confirmation_date: [''],
    confirmed_by: [''],
    confirmation_no: [''],
    user_id: ['']
  })
  errorMessage = ''; 
  successMessage = '';
  ngOnInit(): void { // Lifecycle hook that is called after the component has been initialized
    // this.onSubmitConfirmationForm();
    console.log("Fill in the confirmation form");
  }
  onSubmitConfirmationForm(): void {
    if (this.confirmationForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const localStorageData = localStorage.getItem('selectedChristian'); // Get the user ID from local storage
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const userId = parsedData?.id;

      this.confirmationForm.value['user_id'] = userId; // Assign userId from local storage to the form data

      // Check if the record already exists
      this.confirmationService.getConfirmationByUserId(userId).subscribe(
        (existingRecord: any) => {
          if (existingRecord) {
            // If record exists, update it
            this.confirmationService.updateConfirmation(userId, this.confirmationForm.value).subscribe(
              (response) => {
                console.log('Confirmation information updated successfully:', response); // Log the successful update response
                this.successMessage = 'Confirmation Information updated successfully!'; // Set success message
                this.navigateToMarriage(); // Navigate to the next page after a delay
              },
              (error: any) => {
                console.error('Error updating confirmation information:', error); // Log any error
                this.errorMessage = 'Failed to update confirmation information. Please try again.';
              }
            );
          } else {
            // If record does not exist, create a new one
            this.confirmationService.createConfirmation(this.confirmationForm.value).subscribe(
              (response) => {
                console.log('Confirmation information added successfully:', response); // Log the successful creation response
                this.successMessage = 'Confirmation Information added successfully!'; // Set success message
                this.navigateToMarriage(); // Navigate to the next page after a delay
              },
              (error) => {
                console.error('Error adding confirmation information:', error); // Log any error
                this.errorMessage = 'Failed to add confirmation information. Please try again.';
              }
            );
          }
        },
        (error: any) => {
          console.error('Error checking existing confirmation record:', error); // Log any error
          this.errorMessage = 'Failed to check existing confirmation record. Please try again.';
        }
      );
    }
  }

  navigateToMarriage() {
    setTimeout(() => {
      this.router.navigate(['/edit-marriage']); // Navigate to the marriage page
    }, 1000); // Delay of 2 seconds before navigation
  }

  navigateToEucharist() {
    setTimeout(() => {
      this.router.navigate(['/edit-eucharist']); // Navigate to the eucharist page
    }, 1000); // Delay of 2 seconds before navigation
  }
}
