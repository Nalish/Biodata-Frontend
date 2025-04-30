import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-confirmation',
  imports: [ReactiveFormsModule],
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

    this.confirmationForm.value['user_id'] = localStorage.getItem('userId');
    this.confirmationService.createConfirmation(this.confirmationForm.value).subscribe(
      (response) => {
        console.log('Confirmation information added successfully:', response); // Log the successful registration response
        console.log(this.confirmationForm); // Log the form data
        this.successMessage = 'Confirmation Information Added successfully! Redirecting to next page...'; // Set success message
        this.navigateToMarriage(); // Navigate to the login page after a delay
      })
  }

  navigateToMarriage() {
    setTimeout(() => {
      this.router.navigate(['/marriage']); // Navigate to the marriage page
    }, 1000); // Delay of 2 seconds before navigation
  }

  navigateToEucharist() {
    setTimeout(() => {
      this.router.navigate(['/eucharist']); // Navigate to the eucharist page
    }, 1000); // Delay of 2 seconds before navigation
  }
}
