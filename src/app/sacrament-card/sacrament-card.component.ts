import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sacrament-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sacrament-card.component.html',
  styleUrls: ['./sacrament-card.component.css']
})
export class SacramentCardComponent {
  sacramentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.sacramentForm = this.fb.group({
      personal: this.fb.group({
        jina: [''],
        baba: [''],
        mama: [''],
        kabila: [''],
        clan: [''],
        kijiji: [''],
        subCounty: [''],
        tarehe: [''],
        anaka: ['']
      }),
      ubatizo: this.fb.group({
        kwa: [''],
        tarehe: [''],
        mbatizaji: [''],
        msimamizi: ['']
      }),
      eukaristi: this.fb.group({
        kwa: [''],
        tarehe: ['']
      }),
      kipaimara: this.fb.group({
        kwa: [''],
        tarehe: [''],
        regNo: [''],
        confNo: ['']
      }),
      ndoa: this.fb.group({
        pamojaNa: [''],
        kwa: [''],
        tarehe: [''],
        regNo: [''],
        marrNo: ['']
      })
    });
  }

  onSubmit() {
    console.log(this.sacramentForm.value);
  }
}
