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
  parishName: any = 'how are you'; // Added to store parish name

  showBanner: boolean = false; // Added to control banner visibility
  bannerMessage: string = ''; // Added to store banner message

  constructor(private apiService: ApiService,
    private router: Router
  ) { }
  // Method to handle search functionality


  ngOnInit(): void {
    const userData = localStorage.getItem('userLoggedIn');
    if (userData) {
      const user = JSON.parse(userData);
      const role = user.user.role;
      const userParishId = user.user.parishId;
      const userDeanery = user.user.deanery;

      this.apiService.getChristians().subscribe((data: any[]) => {
        if (role === 'admin' || role === 'archbishop') {
          this.christians = data;
          // Show banner for admin or archbishop
          this.showBanner = true;
          this.bannerMessage = `You are logged in as ${role.toUpperCase()}. You have full access to view and manage all Christians in the system.`;
        } else if (role === 'dean') {
          this.showBanner = true;
          this.bannerMessage = `You are logged in as DEAN. You can view and manage Christians from all parishes in your deanery.`;
          // Dean can view Christians from parishes in their deanery
          this.christians = data.filter(c => c.deanery === userDeanery);
        } else if (role === 'priest' || role === 'clerk') {
          this.showBanner = true;
          this.bannerMessage = `You are logged in as ${role.toUpperCase()}. You can view and manage Christians from your own parish only.`;
          // Priest/Clerk can view Christians from their own parish
          this.christians = data.filter(c => c.parish_id === userParishId);
        } else if (role === 'member') {
          this.showBanner = true;
          this.bannerMessage = `You are logged in as MEMBER. You can only view your own personal information and not other Christians in the system.`;
          // Member cannot view any Christians
          this.christians = [];
        } else {
          // this.showBanner = false;
          // this.bannerMessage = 'You are not logged in. Go to login page.';
          // if (confirm('You are not logged in. Do you want to go to the login page?')) {
          //   this.router.navigate(['/login']);
          // }
          // // Handle other roles if needed

          this.christians = [];
        }
        this.christians.sort((a, b) => a.name.localeCompare(b.name));
      });
    } else {
      this.christians = [];
    }
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


  redirectToUpdateChristian() {
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


  deleteChristian(christian: any): void {
    // get selectedChristian from localStorage
    const getSelectedChristian = localStorage.getItem('selectedChristian');
    if (getSelectedChristian) {
      const selectedChristian = JSON.parse(getSelectedChristian);
      if (confirm(`Are you sure you want to delete ${selectedChristian?.name}?`)) {
        this.apiService.deleteChristian(selectedChristian.id).subscribe(() => {
          // Remove the deleted Christian from the list
          this.christians = this.christians.filter(c => c.id !== selectedChristian.id);
          console.log(`Deleted Christian: ${selectedChristian.name}`);
          // Clear the selected Christian from local storage
          localStorage.removeItem('selectedChristian');
          this.selectedChristian = null;
          this.errorMessage = '';
        }, error => {
          console.error('Error deleting Christian:', error);
          this.errorMessage = 'Error deleting Christian.';
        });
      }
    }
  }


  selectChristian(christian: any): void {
    this.selectedChristian = christian;
    console.clear();
    console.log(christian);
    // localStorage.setItem('selectedChristian', JSON.stringify({ id: christian.id, email: christian.email, role: christian.role, name: christian.name }));


    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (christian) {
      localStorage.setItem('selectedChristian', JSON.stringify({ id: christian.id, email: christian.email, role: christian.role, name: christian.name, parishId: christian.parish_id, deanery: christian.deanery })); // Store the selected Christian in local storage

      const parishId = christian.parish_id;
      if (parishId) {
        this.apiService.getParishById(parishId.toString()).subscribe(
          (parishData: any) => {
            this.parishName = parishData?.parish_name || '';
          },
          error => {
            console.error('Error fetching parish name:', error);
            this.parishName = '';
          }
        );
      } else {
        this.parishName = '';
      }

      this.apiService.getBaptisms().subscribe((baptismData: { user_id: number; baptism_id: number }[]) => {
        const baptism = baptismData.find((b: { user_id: number; baptism_id: number }) => b.user_id === christian.id);
        console.log(baptism);
        if (baptism) {
          this.apiService.getBaptismById(baptism.baptism_id.toString()).subscribe((detailedBaptismData) => {
            this.selectedBaptism = detailedBaptismData;
            this.selectedChristian = christian;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            this.errorMessage = '';
          }, error => {
            this.selectedBaptism = null;
            this.selectedChristian = christian;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            console.error('Error fetching detailed baptism data:', error);
            this.errorMessage = '';
          });
        } else {
          this.selectedBaptism = null;
          this.selectedChristian = christian;
          this.christians.sort((a, b) => a.name.localeCompare(b.name));
          console.error('No matching baptism found for the selected Christian');
          this.errorMessage = '';
        }
      }, error => {
        this.selectedBaptism = null;
        console.error('Error fetching baptism data:', error);
        this.errorMessage = 'Error fetching baptism data.';
      });

      this.apiService.getEucharists().subscribe((eucharistData: { user_id: number; eucharist_id: number }[]) => {
        const eucharist = eucharistData.find((e: { user_id: number; eucharist_id: number }) => e.user_id === christian.id);
        console.log(eucharist);
        if (eucharist) {
          this.apiService.getEucharistById(eucharist.eucharist_id.toString()).subscribe((detailedEucharistData) => {
            this.selectedEucharist = detailedEucharistData;
            this.selectedChristian = christian;
            this.errorMessage = '';
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
          }, error => {
            this.selectedEucharist = null;
            this.selectedChristian = christian;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            console.error('Error fetching detailed eucharist data:', error);
            this.errorMessage = '';
          });
        } else {
          this.selectedEucharist = null;
          this.selectedChristian = christian;
          this.christians.sort((a, b) => a.name.localeCompare(b.name));
          this.errorMessage = '';
          console.error('No matching eucharist found for the selected Christian');
        }
      }, error => {
        this.selectedEucharist = null;
        console.error('Error fetching eucharist data:', error);
        this.errorMessage = 'Error fetching eucharist data.';
      });

      this.apiService.getConfirmations().subscribe((confirmationData: { user_id: number; confirmation_id: number }[]) => {
        const confirmation = confirmationData.find((c: { user_id: number; confirmation_id: number }) => c.user_id === christian.id);
        console.log(confirmation);
        if (confirmation) {
          this.apiService.getConfirmationById(confirmation.confirmation_id.toString()).subscribe((detailedConfirmationData) => {
            this.selectedConfirmation = detailedConfirmationData;
            this.selectedChristian = christian;
            this.errorMessage = '';
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
          }, error => {
            this.selectedConfirmation = null;
            this.selectedChristian = christian;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            this.errorMessage = '';
            console.error('Error fetching detailed confirmation data:', error);
          });
        } else {
          this.selectedConfirmation = null;
          this.selectedChristian = christian;
          this.christians.sort((a, b) => a.name.localeCompare(b.name));
          this.errorMessage = '';
          console.error('No matching confirmation found for the selected Christian');
        }
      }, error => {
        this.selectedConfirmation = null;
        console.error('Error fetching confirmation data:', error);
        this.errorMessage = 'Error fetching confirmation data.';
      });

      this.apiService.getMarriages().subscribe((marriageData: { user_id: number; marriage_id: number }[]) => {
        const marriage = marriageData.find((m: { user_id: number; marriage_id: number }) => m.user_id === christian.id);
        console.log(marriage);
        if (marriage) {
          this.apiService.getMarriageById(marriage.marriage_id.toString()).subscribe((detailedMarriageData) => {
            this.selectedMarriage = detailedMarriageData;
            this.selectedChristian = christian;
            this.errorMessage = '';
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
          }, error => {
            this.selectedMarriage = null;
            this.selectedChristian = christian;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            this.errorMessage = '';
            console.error('Error fetching detailed marriage data:', error);
          });
        } else {
          this.selectedMarriage = null;
          this.selectedChristian = christian;
          this.christians.sort((a, b) => a.name.localeCompare(b.name));
          this.errorMessage = '';
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
      this.christians.sort((a, b) => a.name.localeCompare(b.name));
    }
  }




  searchChristianByName(name: string): void {
    this.apiService.getChristians().subscribe((christians: any[]) => {
      // Check the structure of the data received
      // console.log(christians); // Check the structure of the data received
      // Find the matching Christian by name
      const found = christians.find(christian =>
        christian.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim())
      );
      console.log(found); // Check the found Christian

      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (found) {

        localStorage.setItem('selectedChristian', JSON.stringify({ id: found.id, email: found.email, role: found.role, name: found.name, parishId: found.parish_id, deanery: found.deanery })); // Store the selected Christian in local storage
        // localStorage.setItem('userId', found.id); // Store the user ID in local storage

        // Fetch parish name by ID
        const parishId = found.parish_id;
        if (parishId) {
          this.apiService.getParishById(parishId.toString()).subscribe(
            (parishData: any) => {
              this.parishName = parishData?.parish_name || '';
            },
            error => {
              console.error('Error fetching parish name:', error);
              this.parishName = '';
            }
          );
        } else {
          this.parishName = '';
        }

        this.apiService.getBaptisms().subscribe((baptismData: { user_id: number; baptism_id: number }[]) => {
          const baptism = baptismData.find((b: { user_id: number; baptism_id: number }) => b.user_id === found.id);
          console.log(baptism); // Check the baptism data
          if (baptism) {
            this.apiService.getBaptismById(baptism.baptism_id.toString()).subscribe((detailedBaptismData) => {
              this.selectedBaptism = detailedBaptismData; // Assign the detailed baptism data to selectedBaptism
              this.selectedChristian = found; // Set the selectedChristian to the found Christian
              // Sort the Christians in alphabetical order by name
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              this.errorMessage = '';
            }, error => {
              this.selectedBaptism = null;
              this.selectedChristian = found;
              this.christians.sort((a, b) => a.name.localeCompare(b.name));
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
              console.error('Error fetching detailed baptism data:', error);
              this.errorMessage = '';
              // this.errorMessage = 'Error fetching detailed baptism data.';
            });
          } else {
            this.selectedBaptism = null;
            this.selectedChristian = found;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
            console.error('No matching baptism found for the selected Christian');
            this.errorMessage = '';

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
              this.errorMessage = '';
            });
          } else {
            this.selectedEucharist = null;
            this.selectedChristian = found;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            this.errorMessage = '';
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
              this.errorMessage = '';
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
              console.error('Error fetching detailed confirmation data:', error);
            });
          } else {
            this.selectedConfirmation = null;
            this.selectedChristian = found;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            this.errorMessage = '';
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
              this.errorMessage = '';
              // this.christians = [found, ...christians.filter(c => c !== found)]; // Bring the found Christian to the top of the list
              console.error('Error fetching detailed marriage data:', error);
            });
          } else {
            this.selectedMarriage = null;
            this.selectedChristian = found;
            this.christians.sort((a, b) => a.name.localeCompare(b.name));
            this.errorMessage = '';
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
        // this.christians = [];
        this.christians.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
      , error => {
        // Handle error when fetching Christians
        console.error('Something went wrong while fetching Christians. Try again.', error);
        this.errorMessage = error.error.message || 'Something went wrong while fetching Christians. Try again.';

        this.showBanner = true;
        this.bannerMessage = 'You are not logged in. Go to login page.';
        setTimeout(() => {
          if (confirm('You are not logged in. Do you want to go to the login page?')) {
          this.router.navigate(['/login']);
        }
        }, 3000);
      }
    );
  }
}


