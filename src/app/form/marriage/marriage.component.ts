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
  marriageForm = this.fb.group({
    marriage_certificate_no: [''],
    entry_no: [''],
    county: [''],
    sub_county: [''],
    place_of_marriage: [''],
    marriage_date: [''],
    name1: [''],
    age1: [''],
    marital_status1: [''],
    occupation1: [''],
    residence1: [''],
    name2: [''],
    age2: [''],
    marital_status2: [''],
    occupation2: [''],
    residence2: [''],
    witnessed_by: [''],
    registrar: [''],
    ref_number: [''],
    user_id: ['']
  })
  errorMessage = ''; // Variable to hold error messages
  successMessage = ''; // Variable to hold success messages
  ngOnInit(): void { // Lifecycle hook that is called after the component has been initialized
    // this.onSubmitMarriageForm();
    console.log("Fill in the marriage form"); // Log message to indicate the form is being filled

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
      console.log('Please fill in all required fields.');
      return;
    }
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
    }, 1500); // Delay of 2 seconds before navigation
  }

  navigateTOConfirmation() { // Function to navigate to the confirmation page
    setTimeout(() => {
      this.router.navigate(['/confirmation']); // Navigate to the confirmation page
    } // Delay of 2 seconds before navigation
      , 1000); // Delay of 2 seconds before navigation
  }

}
