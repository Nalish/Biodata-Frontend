import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Corrected from 'styleUrl'
})
export class DashboardComponent {
  constructor(private router: Router, private apiService: ApiService) { }
  christianCount: number = 0; // Added to store the count value

  ngOnInit(): void {
    this.loadUserCount();
  }

  loadUserCount(): void {
    this.apiService.getChristianCount().subscribe(
      (response: any) => {
        this.christianCount = response.userCount;
        console.log('User count:', this.christianCount);
      },
      (error) => {
        console.error('Error fetching user count:', error);
      }
    );
  }


  navigateToSearch() {
    setTimeout(() => {
      this.router.navigate(['/search'])
    }, 1000);
  }

  navigateToForm() {
    setTimeout(() => {
      this.router.navigate(['/personal-info'])
    }, 1000);
  }

  logoutChristian() {
    const localStorageData = localStorage.getItem('userLoggedIn');
    // if (localStorageData) {
    //   const parsedData = JSON.parse(localStorageData);
    //   const email = parsedData?.user.email;
    //   console.log("The logged in email is:", email);
    // }
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const email = parsedData?.user.email;
      if (email) {
        this.apiService.logoutChristian(email).subscribe(
          (response) => {
            console.log('Logout successful:', response);
            alert('Logout successful! Redirecting to login...');
            setTimeout(() => {
              localStorage.removeItem('userLoggedIn'); // Clear the email from local storage
              this.router.navigate(['/login']);
            }, 2000);
          },
          (error: any) => {
            console.error('Logout failed:', error);
          }
        );
      }
    } else {
      console.error('No email found in local storage.');
      alert('Logout failed: No user information found.');
    }
  }

}
