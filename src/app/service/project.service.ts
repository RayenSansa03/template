import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Project {
  nom: string;
  client: string;
  dateDebut: Date;
  dateFin: Date;
  sujet: string;
  budget: number;
  etatProjet: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/api/projects'; // Assurez-vous que cette URL correspond à votre API

  constructor(private http: HttpClient) {}

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }
}
