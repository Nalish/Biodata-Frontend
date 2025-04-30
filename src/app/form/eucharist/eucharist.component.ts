import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-eucharist',
  imports: [ReactiveFormsModule],
  templateUrl: './eucharist.component.html',
  styleUrl: './eucharist.component.css'
})
export class EucharistComponent {
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

    this.eucharistForm.value['user_id'] = localStorage.getItem('userId');
    this.eucharistService.createEucharist(this.eucharistForm.value).subscribe(
      (response) => {
        console.log('Eucharist information added successfully:', response); // Log the successful registration response
        console.log(this.eucharistForm); // Log the form data
        this.successMessage = 'Eucharist Information Added successfully! Redirecting to next page...'; // Set success message
        this.navigateToConfirmation(); // Navigate to the login page after a delay
      })
  }

  navigateToConfirmation() {
    setTimeout(() => {
      this.router.navigate(['/confirmation']); // Navigate to the confirmation page
    }, 1000); // Delay of 2 seconds before navigation
  }

  navigateToPersonalInfo() {
    setTimeout(() => {
      this.router.navigate(['/personal-info']); // Navigate to the personal info page
    }, 1000); // Delay of 2 seconds before navigation
  }


}
