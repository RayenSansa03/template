import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mes-vehicules',
  templateUrl: './mes-vehicules.component.html',
  styleUrls: ['./mes-vehicules.component.css']
})
export class MesVehiculesComponent {
  salleForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.salleForm = this.fb.group({
      nom: ['', Validators.required],
      prixParJour: ['', Validators.required],
      capaciteMaximale: ['', Validators.required],
      etat: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    console.log('File selected:', event.target.files[0]);
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    console.log('Form submitted');
    if (this.salleForm.valid && this.selectedFile) {
      console.log('Form is valid, preparing to send data');
      const formData = new FormData();
      formData.append('nom', this.salleForm.get('nom')?.value);
      formData.append('prixParJour', this.salleForm.get('prixParJour')?.value);
      formData.append('capaciteMaximale', this.salleForm.get('capaciteMaximale')?.value);
      formData.append('etat', this.salleForm.get('etat')?.value);
      formData.append('image', this.selectedFile);

      this.http.post('http://localhost:3000/api/salles', formData).subscribe(
        response => {
          console.log('Salle créée avec succès', response);
        },
        error => {
          console.error('Erreur lors de la création de la salle', error);
        }
      );
    } else {
      console.error('Form is invalid or file not selected');
    }
  }
}
