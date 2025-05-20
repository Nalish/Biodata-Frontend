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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: ['', Validators.required],
    deanery: ['', Validators.required],
    parish_name: ['', Validators.required], // User selects parish_name
    parish_id: [0] // Will be set automatically
  })

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

  filteredParishes: { parish_id: number, parish_name: string }[] = [];

  ngOnInit(): void {
    // Initialize any data if needed
  }

  ngAfterViewInit(): void {
    // Listen for deanery changes to filter parishes
    this.form.get('deanery')?.valueChanges.subscribe((selectedDeanery: string | null) => {
      this.filteredParishes = this.parishes
        .filter(p => p.deanery === selectedDeanery)
        .map(p => ({ parish_id: p.parish_id, parish_name: p.parish_name }));

      // Reset parish selection when deanery changes
      this.form.get('parish_name')?.setValue('');
      this.form.get('parish_id')?.setValue(0);
    });

    // Listen for parish_name changes to update parish_id
    this.form.get('parish_name')?.valueChanges.subscribe((selectedParishName: string | null) => {
      if (selectedParishName) {
        // Find the parish ID for the selected parish name
        const selectedParish = this.parishes.find(p => p.parish_name === selectedParishName);
        if (selectedParish) {
          // Set the parish_id in the form
          this.form.get('parish_id')?.setValue(selectedParish.parish_id);
        }
      }
    });
  }

  onSubmitForm(): void {
    this.registerMessage = 'Registering...';
    this.errorMessage = '';
    this.register.registerChristian(this.form.value).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        console.log(this.form);
        // Store the token in local storage or session storage
        // localStorage.setItem('token', response.token); // Adjust according to your API response
        this.registerMessage = '';
        this.errorMessage = '';
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
    }, 1500);
  }

  // onSubmitForm(): void {
  //   setTimeout(() => {
  //     this.register.registerChristian(this.form.value).subscribe(
  //       (response) => {
  //         console.log('Registration successful:', response);
  //         this.successMessage = 'Registration successful! Redirecting to login in 5 seconds...';
  //         this.navigateToLogin();
  //       },
  //       (error: any) => {
  //         console.error('Registration failed:', error);
  //         this.errorMessage = error.error.message || 'Registration failed. Please try again.';
  //       }
  //     );
  //   }, 1500);

  // }
}