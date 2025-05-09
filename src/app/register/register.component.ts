import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  errorMessage = '';
  successMessage = '';
  registerMessage = '';
  isLoading: boolean = false;

  constructor(private register: ApiService, private router: Router) { }


  private fb = inject(FormBuilder)
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required, Validators.minLength(4)],
    role: ['', Validators.required],
  })


  ngOnInit(): void {
    if (this.form.invalid) {
      this.registerMessage = 'Please fill in all required fields.';
      return;
    }
    // this.onSubmitForm();
  }

  onSubmit(): void {

    this.register.registerChristian(this.form.value).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        console.log(this.form);
        // Store the token in local storage or session storage
        // localStorage.setItem('token', response.token); // Adjust according to your API response
        this.registerMessage = '';
        this.successMessage = 'Registration successful! Redirecting to login...';
        // Set loading state to true
        // this.isLoading = true;
        this.navigateToLogin();
      },

      (error: any) => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error.message;
      }
    );


  }
  navigateToLogin(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }

  onSubmitForm(): void {
    setTimeout(() => {
      this.register.registerChristian(this.form.value).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.successMessage = 'Registration successful! Redirecting to login in 5 seconds...';
          this.navigateToLogin();
        },
        (error: any) => {
          console.error('Registration failed:', error);
          this.errorMessage = error.error.message || 'Registration failed. Please try again.';
        }
      );
    }, 1500);

  }
}