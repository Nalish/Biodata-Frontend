import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marriage',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './marriage.component.html',
  styleUrl: './marriage.component.css'
})
export class MarriageComponent {
  constructor(
    private marriageService: ApiService, // Inject ApiService for API calls
    private router: Router // Inject Router for navigation
  ) { } // Constructor for the component
  private fb = inject(FormBuilder) // Inject FormBuilder for form creation
  marriageForm = this.fb.group({ // Create a form group for the marriage form
    spouse_name: [''],
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
    const localStorageData = localStorage.getItem('addedChristian'); // Get the user ID from local storage
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const userId = parsedData?.id;
    this.marriageForm.value['user_id'] = userId;
    this.marriageService.createMarriage(this.marriageForm.value).subscribe( // Call the API to create marriage information
      (response) => {
        console.log('Marriage information added successfully:', response); // Log the successful registration response
        console.log(this.marriageForm); // Log the form data
        this.successMessage = 'Marriage Information Added successfully! Redirecting to next page...'; // Set success message
        localStorage.removeItem('addedChristian'); // Remove the user ID from local storage
        this.navigateToDashboard(); // Navigate to the next page after a delay
      })
    }
  }
  navigateToDashboard() { // Function to navigate to the next page
    setTimeout(() => {
      this.router.navigate(['/dashboard']); // Navigate to the family page
    }, 5000); // Delay of 2 seconds before navigation
  }

  navigateTOConfirmation() { // Function to navigate to the confirmation page
    setTimeout(() => {
      this.router.navigate(['/confirmation']); // Navigate to the confirmation page
    } // Delay of 2 seconds before navigation
      , 1000); // Delay of 2 seconds before navigation
  }

}
