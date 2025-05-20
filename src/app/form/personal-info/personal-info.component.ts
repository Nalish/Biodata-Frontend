import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit, AfterViewInit {
  // Form group
  christianForm: FormGroup;
  
  // Feedback messages
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  
  // User data
  userId: number | null = null;

  // Church hierarchy data
  deaneries: string[] = [
    'Nyeri Municipality Deanery',
    'Mukurwe-ini Deanery',
    'Othaya Deanery',
    'Nanyuki Deanery',
    'Narumoru Deanery',
    'Karatina Deanery',
    'Tetu Deanery',
    'Gatarakwa Deanery'
  ];

  parishes: { parish_id: number, parish_name: string, deanery: string }[] = [
    { parish_id: 1, parish_name: 'Cathedral Parish (Our Lady of Consolata Cathedral)', deanery: 'Nyeri Municipality Deanery' },
    { parish_id: 2, parish_name: 'St. Jude Parish', deanery: 'Nyeri Municipality Deanery' },
    { parish_id: 3, parish_name: "King'ong'o Parish", deanery: 'Nyeri Municipality Deanery' },
    { parish_id: 4, parish_name: 'Mwenji Parish', deanery: 'Nyeri Municipality Deanery' },
    { parish_id: 5, parish_name: 'Kiamuiru Parish', deanery: 'Nyeri Municipality Deanery' },
    { parish_id: 6, parish_name: 'Mathari Institutions Chaplaincy', deanery: 'Nyeri Municipality Deanery' },
    { parish_id: 7, parish_name: 'St. Charles Lwanga Parish', deanery: 'Nyeri Municipality Deanery' },
    { parish_id: 8, parish_name: 'Mukurwe-ini Parish', deanery: 'Mukurwe-ini Deanery' },
    { parish_id: 9, parish_name: 'Kaheti Parish', deanery: 'Mukurwe-ini Deanery' },
    { parish_id: 10, parish_name: 'Kimondo Parish', deanery: 'Mukurwe-ini Deanery' },
    { parish_id: 11, parish_name: 'Gikondi Parish', deanery: 'Mukurwe-ini Deanery' },
    { parish_id: 12, parish_name: 'Othaya Parish', deanery: 'Othaya Deanery' },
    { parish_id: 13, parish_name: 'Kariko Parish', deanery: 'Othaya Deanery' },
    { parish_id: 14, parish_name: 'Birithia Parish', deanery: 'Othaya Deanery' },
    { parish_id: 15, parish_name: 'Karima Parish', deanery: 'Othaya Deanery' },
    { parish_id: 16, parish_name: 'Kagicha Parish', deanery: 'Othaya Deanery' },
    { parish_id: 17, parish_name: 'Karuthi Parish', deanery: 'Othaya Deanery' },
    { parish_id: 18, parish_name: 'Kigumo Parish', deanery: 'Othaya Deanery' },
    { parish_id: 19, parish_name: 'Nanyuki Parish', deanery: 'Nanyuki Deanery' },
    { parish_id: 20, parish_name: 'Dol Dol Parish', deanery: 'Nanyuki Deanery' },
    { parish_id: 21, parish_name: 'Matanya Parish', deanery: 'Nanyuki Deanery' },
    { parish_id: 22, parish_name: 'St. Teresa Parish', deanery: 'Nanyuki Deanery' },
    { parish_id: 23, parish_name: 'Kalalu Parish', deanery: 'Nanyuki Deanery' },
    { parish_id: 24, parish_name: 'Narumoru Town Parish', deanery: 'Narumoru Deanery' },
    { parish_id: 25, parish_name: 'Irigithathi Parish', deanery: 'Narumoru Deanery' },
    { parish_id: 26, parish_name: 'Thegu Parish', deanery: 'Narumoru Deanery' },
    { parish_id: 27, parish_name: 'Archangel Michael Chaka Parish', deanery: 'Narumoru Deanery' },
    { parish_id: 28, parish_name: 'Munyu Parish', deanery: 'Narumoru Deanery' },
    { parish_id: 29, parish_name: 'Karatina Parish', deanery: 'Karatina Deanery' },
    { parish_id: 30, parish_name: 'Miiri Parish', deanery: 'Karatina Deanery' },
    { parish_id: 31, parish_name: 'Giakaibei Parish', deanery: 'Karatina Deanery' },
    { parish_id: 32, parish_name: 'Gikumbo Parish', deanery: 'Karatina Deanery' },
    { parish_id: 33, parish_name: 'Gathugu Parish', deanery: 'Karatina Deanery' },
    { parish_id: 34, parish_name: 'Ngandu Parish', deanery: 'Karatina Deanery' },
    { parish_id: 35, parish_name: 'Kabiru-ini Parish', deanery: 'Karatina Deanery' },
    { parish_id: 36, parish_name: 'Kahira-ini Parish', deanery: 'Karatina Deanery' },
    { parish_id: 37, parish_name: 'Tetu Parish', deanery: 'Tetu Deanery' },
    { parish_id: 38, parish_name: 'Wamagana Parish', deanery: 'Tetu Deanery' },
    { parish_id: 39, parish_name: 'Kigogo-ini Parish', deanery: 'Tetu Deanery' },
    { parish_id: 40, parish_name: 'Itheguri Parish', deanery: 'Tetu Deanery' },
    { parish_id: 41, parish_name: 'Gititu Parish', deanery: 'Tetu Deanery' },
    { parish_id: 42, parish_name: 'Kangaita Parish', deanery: 'Tetu Deanery' },
    { parish_id: 43, parish_name: 'Giakanja Parish', deanery: 'Tetu Deanery' },
    { parish_id: 44, parish_name: 'Karangia Parish', deanery: 'Tetu Deanery' },
    { parish_id: 45, parish_name: 'Mweiga Parish', deanery: 'Gatarakwa Deanery' },
    { parish_id: 46, parish_name: 'Endarasha Parish', deanery: 'Gatarakwa Deanery' },
    { parish_id: 47, parish_name: 'Gatarakwa Parish', deanery: 'Gatarakwa Deanery' },
    { parish_id: 48, parish_name: 'Karemeno Parish', deanery: 'Gatarakwa Deanery' },
    { parish_id: 49, parish_name: 'Mugunda Parish', deanery: 'Gatarakwa Deanery' },
    { parish_id: 50, parish_name: 'Sirima Parish', deanery: 'Gatarakwa Deanery' },
    { parish_id: 51, parish_name: 'Winyumiririe Parish', deanery: 'Gatarakwa Deanery' },
    { parish_id: 52, parish_name: 'Kamariki Parish', deanery: 'Gatarakwa Deanery' }
  ];

  filteredParishes: string[] = [];

  private fb = inject(FormBuilder);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Initialize form with validation
    this.christianForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      role: ['', Validators.required],
      deanery: ['', Validators.required],
      parish_name: ['', Validators.required],
      parish_id: [0],
      father: [''],
      mother: [''],
      tribe: [''],
      clan: [''],
      birth_place: [''],
      birth_date: ['', Validators.required],
      sub_county: [''],
      residence: [''],
    });
  }

  ngOnInit(): void {
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
      this.christianForm.patchValue(formData);
    }
  }

  ngAfterViewInit(): void {
    // Setup form control dependencies
    this.setupFormDependencies();
  }


  /**
   * Setup form control dependencies like filtering parishes by deanery
   */
  private setupFormDependencies(): void {
    // When deanery changes, filter parishes
    this.christianForm.get('deanery')?.valueChanges.subscribe((selectedDeanery: string | null) => {
      if (!selectedDeanery) {
        this.filteredParishes = [];
        return;
      }
      
      this.filteredParishes = this.parishes
        .filter(p => p.deanery === selectedDeanery)
        .map(p => p.parish_name);
      
      // Reset parish selection
      this.christianForm.get('parish_name')?.setValue('');
      this.christianForm.get('parish_id')?.setValue(0);
    });
    
    // When parish changes, set parish_id
    this.christianForm.get('parish_name')?.valueChanges.subscribe((selectedParishName: string | null) => {
      if (!selectedParishName) {
        this.christianForm.get('parish_id')?.setValue(0);
        return;
      }
      
      const parishId = this.getParishIdByName(selectedParishName);
      this.christianForm.get('parish_id')?.setValue(parishId);
    });
  }

  /**
   * Find parish ID by name
   */
  getParishIdByName(parishName: string): number | null {
    if (!parishName) return null;

    const parish = this.parishes.find(p => p.parish_name === parishName.trim());
    return parish?.parish_id || null;
  }

  /**
   * Submit the form
   */
  onSubmitChristianForm(): void {
    if (this.christianForm.invalid) {
      this.markFormGroupTouched(this.christianForm);
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = 'Submitting your information...';

    // Ensure parish_id is set correctly
    const formValue = this.christianForm.value;
    const parishName = formValue.parish_name ?? '';
    const parishId = this.getParishIdByName(parishName);
    
    if (parishId) {
      this.christianForm.patchValue({ parish_id: parishId });
    }

    // Save form data to session storage in case of navigation issues
    sessionStorage.setItem('christianFormData', JSON.stringify(this.christianForm.value));

    // Submit to API
    this.apiService.addChristian(this.christianForm.value).subscribe({
      next: (response) => {
        this.handleSuccessfulSubmission();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.successMessage = '';
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        console.error('Error adding Christian:', error);
      }
    });
  }

  /**
   * Handle successful form submission
   */
  private handleSuccessfulSubmission(): void {
    this.apiService.getChristians().subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data)) {
          console.error('Invalid data format received from getChristians API');
          return;
        }
        
        // Find the highest user ID (presumably the one just added)
        this.userId = data.reduce((max: number, user: any) => 
          user.id > max ? user.id : max, 0);
        
        const user = data.find((user: any) => user.id === this.userId);
        
        if (user) {
          localStorage.setItem('addedChristian', JSON.stringify({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
          }));
          
          this.successMessage = 'Personal information saved successfully! Redirecting to baptism form...';
          
          // Clear session storage since we've successfully saved
          sessionStorage.removeItem('christianFormData');
          
          // Navigate to next step
          this.navigateToBaptism();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error fetching Christians:', error);
        this.errorMessage = 'Information saved, but there was an issue retrieving your profile.';
        
        // Still navigate to next step despite the error
        setTimeout(() => this.navigateToBaptism(), 2000);
      }
    });
  }

  /**
   * Utility to mark all controls in a form group as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Navigation methods
   */
  navigateToBaptism(): void {
    setTimeout(() => {
      this.router.navigate(['/baptism']);
    }, 1500);
  }

  navigateToDashboard(): void {
    // Save form data before navigating away
    if (this.christianForm.dirty) {
      sessionStorage.setItem('christianFormData', JSON.stringify(this.christianForm.value));
    }
    
    this.router.navigate(['/dashboard']);
  }
}