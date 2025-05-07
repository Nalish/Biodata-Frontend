import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-marriage',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './marriage.component.html',
  styleUrl: './marriage.component.css'
})
export class MarriageUpdateComponent {
  constructor(
    private marriageService: ApiService, // Inject ApiService for API calls
    private router: Router // Inject Router for navigation
  ) { } // Constructor for the component
  private fb = inject(FormBuilder) // Inject FormBuilder for form creation
  marriageForm = this.fb.group({ // Create a form group for the marriage form
    spouse: [''],
    marriage_place: [''],
    marriage_date: [''],
    marriage_no: [''],
    user_id: ['']
  })
  errorMessage = ''; // Variable to hold error messages
  successMessage = ''; // Variable to hold success messages
  ngOnInit(): void { // Lifecycle hook that is called after the component has been initialized
    // this.onSubmitMarriageForm();
    console.log("Fill in the marriage form"); // Log message to indicate the form is being filled
  }
  onSubmitMarriageForm(): void { // Function to handle the submission of the marriage form
    if (this.marriageForm.invalid) { // Check if the form is invalid
      this.errorMessage = 'Please fill in all required fields.'; // Set error message
      return; // Exit the function if the form is invalid
    }

    const localStorageData = localStorage.getItem('selectedChristian'); // Get the user ID from local storage
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const userId = parsedData?.id;

      this.marriageForm.value['user_id'] = userId; // Assign userId from local storage to the form data

      // Check if the record already exists
      this.marriageService.getMarriageByUserId(userId).subscribe(
        (existingRecord: any) => {
          if (existingRecord) {
            // If record exists, update it
            this.marriageService.updateMarriage(userId, this.marriageForm.value).subscribe(
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
                this.navigateToDashboard(); // Navigate to the next page after a delay
              },
              (error) => {
                console.error('Error adding marriage information:', error); // Log any error
                this.errorMessage = 'Failed to add marriage information. Please try again.';
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
  navigateToDashboard() { // Function to navigate to the next page
    setTimeout(() => {
      this.router.navigate(['/dashboard']); // Navigate to the family page
    }, 1000); // Delay of 2 seconds before navigation
  }

  navigateTOConfirmation() { // Function to navigate to the confirmation page
    setTimeout(() => {
      this.router.navigate(['/edit-confirmation']); // Navigate to the confirmation page
    } // Delay of 2 seconds before navigation
      , 1000); // Delay of 2 seconds before navigation
  }

}
