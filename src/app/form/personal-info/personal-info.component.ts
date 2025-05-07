import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true, // Indicates that this component is a standalone component
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {

  constructor(
    private personalInfo: ApiService, // Inject the ApiService for API calls
    private router: Router, // Inject the Router for navigation
    private getUser: ApiService // Inject the ApiService for user-related API calls
  ) { } // Constructor for the component

  private fb = inject(FormBuilder) // Inject FormBuilder for form creation

  christianForm = this.fb.group({ // Create a form group for the personal information form
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: [''],
    role: ['', Validators.required],
    father: [''],
    mother: [''],
    tribe: [''],
    clan: [''],
    birth_place: [''],
    birth_date: ['', Validators.required],
    sub_county: [''],
    residence: [''],
  })

  errorMessage = '';
  successMessage = '';
  userId: any // Variable to store the user ID

  ngOnInit(): void { // Lifecycle hook that is called after the component has been initialized
    this.onSubmitChristianForm();
  }


  onSubmitChristianForm(): void {
    if (this.christianForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      console.log('Please fill in all required fields.');
      return;
    }
    this.personalInfo.addChristian(this.christianForm.value).subscribe(
      (response) => {
        this.getUser.getChristians().subscribe(
          (data) => {
            // console.log('Fetched data:', data); // Log the fetched data

            this.userId = data?.reduce((max: any, user: any) => user.id > max ? user.id : max, 0); // Get the greatest id from the data
            const user = data?.find((user: any) => user.id === this.userId);
            if (user) {
              localStorage.setItem('addedChristian',JSON.stringify({ id: user.id, email: user.email, role: user.role }))
            }
            console.log('Fetched userId:', this.userId); // Log the fetched userId
            this.successMessage = 'Personal Information Added successfully! Redirecting to next page...'; // Set success message
            this.navigateToBaptism(); // Navigate to the login page after a delay
          }
        );
        console.log('Christian Added successfully:', response); // Log the successful registration response
        console.log(this.christianForm); // Log the form data
      },
      // Handle the error response from the API
      (error: any) => {
        console.error('Error Adding this Christian:', error); // Log the error response
        this.errorMessage = error.error.message; // Set the error message
      }
    )
      
  }

  navigateToBaptism() {
    setTimeout(() => {
      this.router.navigate(['/baptism']); // Navigate to the baptism page
    }
      , 1000);
  } // End of navigateToBaptism method

  navigateToDashboard() {
    setTimeout(() => {
      this.router.navigate(['/dashboard']); // Navigate to the dashboard page
    }, 1000); // Delay of 2 seconds before navigation
  } // End of navigateToDashboard method

}
