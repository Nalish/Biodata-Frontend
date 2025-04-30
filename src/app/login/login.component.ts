import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


export interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage = '';

  isLoading: boolean = false; // To indicate loading state

  constructor(private router: Router, private apiservice: ApiService) {}

  private login = inject(ApiService)
  private fb = inject(FormBuilder)
  form = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  })

ngOnInit(): void {
  this.onSubmit();
}

onSubmit():void {
  if (this.form.invalid) {
    this.errorMessage = 'Please fill in all required fields.';
    return;
  }
  this.login.loginChristian(this.form.value).subscribe(
    
    (response) => {
      localStorage.setItem('user', JSON.stringify(response))
      console.log('Login successful:', response);
      console.log(this.form);
      // Store the token in local storage or session storage
      // localStorage.setItem('token', response.token); // Adjust according to your API response
      this.successMessage = 'Login successful! Redirecting to dashboard...';
      this.navigateToDashboard();
    },
    (error: any) => {
      console.error('Login failed:', error);
      this.errorMessage = error.error.message ||'Invalid email or password. Please try again.';
    });
}

  navigateToDashboard(): void {
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500); // Delay to show success message
  }

  navigateToRegister(): void {
    setTimeout(() => {
      this.router.navigate(['/register']);
    }, 1000); // Delay to show registration page
  }
}
