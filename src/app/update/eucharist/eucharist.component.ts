import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-eucharist',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './eucharist.component.html',
  styleUrl: './eucharist.component.css'
})
export class EucharistUpdateComponent {
  constructor(
    private router: Router,
    private eucharistService: ApiService // Inject ApiService for API calls
  ) { }

  private fb = inject(FormBuilder) // Inject FormBuilder for form creation
  eucharistForm = this.fb.group({ // Create a form group for the eucharist form
    eucharist_place: [''],
    eucharist_date: [''],
    user_id: [''],
  });

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void { // Lifecycle hook that is called after the component has been initialized
    // this.onSubmitEucharistForm();
    console.log("Fill in the eucharist form");
  }

  onSubmitEucharistForm(): void {
    if (this.eucharistForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const localStorageData = localStorage.getItem('selectedChristian'); // Get the user ID from local storage
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const userId = parsedData?.id;

      this.eucharistForm.value['user_id'] = userId; // Assign userId from local storage to the form data

      // Check if the record already exists
      this.eucharistService.getEucharistByUserId(userId).subscribe(
        (existingRecord: any) => {
          if (existingRecord) {
            // If record exists, update it
            this.eucharistService.updateEucharist(userId, this.eucharistForm.value).subscribe(
              (response) => {
                console.log('Eucharist information updated successfully:', response); // Log the successful update response
                this.successMessage = 'Eucharist Information updated successfully!'; // Set success message
                this.navigateToConfirmation(); // Navigate to the next page after a delay
              },
              (error: any) => {
                console.error('Error updating eucharist information:', error); // Log any error
                this.errorMessage = 'Failed to update eucharist information. Please try again.';
              }
            );
          } else {
            // If record does not exist, create a new one
            this.eucharistService.createEucharist(this.eucharistForm.value).subscribe(
              (response) => {
                console.log('Eucharist information added successfully:', response); // Log the successful creation response
                this.successMessage = 'Eucharist Information added successfully!'; // Set success message
                this.navigateToConfirmation(); // Navigate to the next page after a delay
              },
              (error) => {
                console.error('Error adding eucharist information:', error); // Log any error
                this.errorMessage = 'Failed to add eucharist information. Please try again.';
              }
            );
          }
        },
        (error: any) => {
          console.error('Error checking existing eucharist record:', error); // Log any error
          this.errorMessage = 'Failed to check existing eucharist record. Please try again.';
        }
      );
    }
  }

  navigateToConfirmation() {
    setTimeout(() => {
      this.router.navigate(['/edit-confirmation']); // Navigate to the confirmation page
    }, 1000); // Delay of 2 seconds before navigation
  }

  navigateToBaptism() {
    setTimeout(() => {
      this.router.navigate(['/edit-baptism']); // Navigate to the personal info page
    }, 1000); // Delay of 2 seconds before navigation
  }


}
