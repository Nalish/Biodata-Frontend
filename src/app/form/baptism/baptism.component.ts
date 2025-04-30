import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-baptism',
  imports: [ReactiveFormsModule],
  templateUrl: './baptism.component.html',
  styleUrl: './baptism.component.css'
})
export class BaptismComponent {
constructor(
  private router: Router, // Inject Router for navigation
  private baptismService: ApiService // Inject ApiService for API calls
){}

  private fb = inject(FormBuilder) // Inject FormBuilder for form creation
  baptismForm = this.fb.group({ // Create a form group for the baptism form
    baptism_place: [''],
    baptism_date: [''],
    baptised_by: [''],
    administrator: [''],
    user_id: [''],
  })

  errorMessage = '';
  successMessage = '';
  userId: any // Variable to store the user ID
  ngOnInit(): void { // Lifecycle hook that is called after the component has been initialized
    // this.onSubmitBaptismForm();
    console.log("Fill in the baptism form");
  }

  onSubmitBaptismForm(): void {
    if (this.baptismForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    this.baptismForm.value['user_id'] = localStorage.getItem('userId'); // Assign userId from local storage to the form data
    this.baptismService.createBaptism(this.baptismForm.value).subscribe(
      (response) => {
        console.log('Baptism information added successfully:', response); // Log the successful registration response
        console.log(this.baptismForm); // Log the form data
        this.successMessage = 'Baptism Information Added successfully! Redirecting to next page...'; // Set success message
        this.navigateToEucharist(); // Navigate to the login page after a delay
      })
  }

  navigateToEucharist() {
    setTimeout(() => {
      this.router.navigate(['/eucharist']); // Navigate to the eucharist page
    }, 1000); // Delay of 2 seconds before navigation
  }

  navigateToPersonalInfo() {
    setTimeout(() => {
      this.router.navigate(['/personal-info']); // Navigate to the personal info page
    }, 1000); // Delay of 2 seconds before navigation
  }

}
