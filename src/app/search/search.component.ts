import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  // Add any methods or properties needed for the search functionality
  searchQuery: string = '';
  christians: any[] = []; // Replace 'any' with your actual data type
  baptismData: any[] = [];
  eucharistData: any[] = [];
  confirmationData: any[] = [];
  marriageData: any[] = [];

  selectedChristian: any = null;
  errorMessage: string = '';
  selectedBaptism: any = null; // Added to store baptism data
  selectedEucharist: any = null; // Added to store eucharist data
  selectedConfirmation: any = null; // Added to store confirmation data
  selectedMarriage: any = null; // Added to store marriage data

  constructor(private apiService: ApiService,
    private router:Router
  ) { }
  // Method to handle search functionality


  ngOnInit(): void {
    this.displayChristians();
    // Initialization logic here
  }

  displayChristians(): void {
    this.apiService.getChristians().subscribe((data) => {
      this.christians = data
      this.christians.sort((a, b) => a.name.localeCompare(b.name));
      // console.log(this.christians); // Check the structure of the data received
    });
  }
  searchChristianById(id: string): void {
    this.apiService.getChristianById(id).subscribe((data) => {
      this.christians = [data]; // Assuming you want to display a single Christian
    });
  }


  clearSearch(): void {
    this.searchQuery = '';
    this.displayChristians(); // Reset to all Christians if search query is cleared 
  }


  redirectToUpdateChristian(){
    const selectedChristian = localStorage.getItem('selectedChristian');
    if (selectedChristian) {
      const christianData = JSON.parse(selectedChristian);
      const id = christianData.id;
      const email = christianData.email;
      // Redirect to the update Christian page with the ID and email
      setTimeout(() => {
        this.router.navigate(['/edit-personal-info'], { queryParams: { id } });
      }, 1000);
        } else {
      console.error('No Christian selected for redirection.');
    }
  }


  searchChristianByName(name: string): void {
    this.apiService.getChristians().subscribe((christians: any[]) => {
      // Check the structure of the data received
      console.log(christians); // Check the structure of the data received
      // Find the matching Christian by name
      const found = christians.find(christian =>
        christian.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim())
      );
      console.log(found); // Check the found Christian


      if (found) {

        localStorage.setItem('selectedChristian', JSON.stringify({ id: found.id, email: found.email, role: found.role, name: found.name})); // Store the selected Christian in local storage
        // localStorage.setItem('userId', found.id); // Store the user ID in local storage

        this.apiService.getBaptisms().subscribe((baptismData: { user_id: number; baptism_id: number }[]) => {
          const baptism = baptismData.find((b: { user_id: number; baptism_id: number }) => b.user_id === found.id);
          console.log(baptism); // Check the baptism data
          if (baptism) {
            this.apiService.getBaptismById(baptism.baptism_id.toString()).subscribe((detailedBaptismData) => {
              this.selectedBaptism = detailedBaptismData; // Assign the detailed baptism data to selectedBaptism
              this.selectedChristian = found; // Set the selectedChristian to the found Christian
              // Sort the Christians in alphabetical order by name
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
            }, error => {
              this.selectedBaptism = null;
              this.selectedChristian = found;
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
              console.error('Error fetching detailed baptism data:', error);
              // this.errorMessage = 'Error fetching detailed baptism data.';
            });
          } else {
            this.selectedBaptism = null;
            this.selectedChristian = found;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
            console.error('No matching baptism found for the selected Christian');

            // this.errorMessage = 'No matching Baptism found for the selected Christian.';

          }

        }, error => {
          this.selectedBaptism = null;
          console.error('Error fetching baptism data:', error);
          this.errorMessage = 'Error fetching baptism data.';
        });

        // Fetch eucharist data to compare IDs
        this.apiService.getEucharists().subscribe((eucharistData: { user_id: number; eucharist_id: number }[]) => {
          const eucharist = eucharistData.find((e: { user_id: number; eucharist_id: number }) => e.user_id === found.id);
          console.log(eucharist); // Check the eucharist data
          if (eucharist) {
            this.apiService.getEucharistById(eucharist.eucharist_id.toString()).subscribe((detailedEucharistData) => {
              this.selectedEucharist = detailedEucharistData; // Assign the detailed eucharist data to selectedEucharist
              this.selectedChristian = found; // Set the selectedChristian to the found Christian
              this.errorMessage = ''; // Clear any previous error messages
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
            }, error => {
              this.selectedEucharist = null;
              this.selectedChristian = found;
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
              console.error('Error fetching detailed eucharist data:', error);
            });
          } else {
            this.selectedEucharist = null;
            this.selectedChristian = found;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
            console.error('No matching eucharist found for the selected Christian');
          }
        }, error => {
          this.selectedEucharist = null;
          console.error('Error fetching eucharist data:', error);
          this.errorMessage = 'Error fetching eucharist data.';
        });


        // Fetch confirmation data to compare IDs
        this.apiService.getConfirmations().subscribe((confirmationData: { user_id: number; confirmation_id: number }[]) => {
          const confirmation = confirmationData.find((c: { user_id: number; confirmation_id: number }) => c.user_id === found.id);
          console.log(confirmation); // Check the confirmation data
          if (confirmation) {
            this.apiService.getConfirmationById(confirmation.confirmation_id.toString()).subscribe((detailedConfirmationData) => {
              this.selectedConfirmation = detailedConfirmationData; // Assign the detailed confirmation data to selectedConfirmation
              this.selectedChristian = found; // Set the selectedChristian to the found Christian
              this.errorMessage = ''; // Clear any previous error messages
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
            }, error => {
              this.selectedConfirmation = null;
              this.selectedChristian = found;
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
              console.error('Error fetching detailed confirmation data:', error);
            });
          } else {
            this.selectedConfirmation = null;
            this.selectedChristian = found;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
            console.error('No matching confirmation found for the selected Christian');
          }
        }, error => {
          this.selectedConfirmation = null;
          console.error('Error fetching confirmation data:', error);
          this.errorMessage = 'Error fetching confirmation data.';
        });


        // Fetch marriage data to compare IDs
        this.apiService.getMarriages().subscribe((marriageData: { user_id: number; marriage_id: number }[]) => {
          const marriage = marriageData.find((m: { user_id: number; marriage_id: number }) => m.user_id === found.id);
          console.log(marriage); // Check the marriage data
          if (marriage) {
            this.apiService.getMarriageById(marriage.marriage_id.toString()).subscribe((detailedMarriageData) => {
              this.selectedMarriage = detailedMarriageData; // Assign the detailed marriage data to selectedMarriage
              this.selectedChristian = found; // Set the selectedChristian to the found Christian
              this.errorMessage = ''; // Clear any previous error messages
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
            }, error => {
              this.selectedMarriage = null;
              this.selectedChristian = found;
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
              console.error('Error fetching detailed marriage data:', error);
            });
          } else {
            this.selectedMarriage = null;
            this.selectedChristian = found;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
            console.error('No matching marriage found for the selected Christian');
          }
        }, error => {
          this.selectedMarriage = null;
          console.error('Error fetching marriage data:', error);
          this.errorMessage = 'Error fetching marriage data.';
        });


      } else {
        this.selectedChristian = null;
        console.error('Christian not found');
        this.errorMessage = 'Christian not found.';
        this.christians = [];
      }
    }
      , error => {
        console.error('Something went wrong while fetching Christians. Try again.', error);
        this.errorMessage = 'Something went wrong while fetching Christians. Try again.';
      }
    );




  }

}


