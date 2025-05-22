import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-marriage-card',
  imports: [],
  templateUrl: './marriage-card.component.html',
  styleUrl: './marriage-card.component.css'
})
export class MarriageCardComponent implements OnInit {
  constructor(private marriageService: ApiService) { }


  marriage_certificate_no: string = '000000';
  marriage_date: string = '';
  entry_no: string = '';
  county: string = '';
  sub_county: string = '';
  place_of_marriage: string = '';

  // First person
  name1: string = '';
  age1: string = '';
  marital_status1: string = '';
  occupation1: string = '';
  residence1: string = '';

  // Second person
  name2: string = '';
  age2: string = '';
  marital_status2: string = '';
  occupation2: string = '';
  residence2: string = '';

  // Additional information
  witnessed_by: string = '';
  registrar: string = '';
  ref_number: string = 'GFIN/MLD/HQ/03650/05/2021';

  printCard(): void {
    window.print();
  }


  ngOnInit(): void {
    // Fetch marriage details by userId from localStorage and bind to component properties
    const localStorageData = localStorage.getItem('selectedChristian');
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const userId = parsedData?.id;
      if (userId) {
        this.marriageService.getMarriageByUserId(userId).subscribe(
          (records: any[]) => {
            if (records && records.length > 0) {
              const record = records[0];
              console.log('Marriage record:', record);
              this.marriage_certificate_no = record.marriage_certificate_no || '';
              this.marriage_date = record.marriage_date ? record.marriage_date.split('T')[0] : '';
              this.entry_no = record.entry_no || '';
              this.county = record.county || '';
              this.sub_county = record.sub_county || '';
              this.place_of_marriage = record.place_of_marriage || '';
              this.name1 = record.name1 || '';
              this.age1 = record.age1 || '';
              this.marital_status1 = record.marital_status1 || '';
              this.occupation1 = record.occupation1 || '';
              this.residence1 = record.residence1 || '';
              this.name2 = record.name2 || '';
              this.age2 = record.age2 || '';
              this.marital_status2 = record.marital_status2 || '';
              this.occupation2 = record.occupation2 || '';
              this.residence2 = record.residence2 || '';
              this.witnessed_by = record.witnessed_by || '';
              this.registrar = record.registrar || '';
              this.ref_number = record.ref_number || '';
            }
            else {
              console.log('No marriage records found for the user.');
            }
          }
        );
      }
      else {
        console.log('User ID not found in localStorage.');
      }
    }
    else {
      console.log('No data found in localStorage.');
    }
  }

}
