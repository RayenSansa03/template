import { Component, OnInit } from '@angular/core';

interface ToDo {
  idL: string;
  description: string;
  etat: string;
  dateCreation: Date;
}

@Component({
  selector: 'app-carte-fidelite',
  templateUrl: './carte-fidelite.component.html',
  styleUrls: ['./carte-fidelite.component.css'],
})
export class CarteFideliteComponent implements OnInit {
  listeToDos: ToDo[] = []; // Liste des tâches
  selectedToDo: ToDo = {
    idL: '',
    description: '',
    etat: '',
    dateCreation: new Date(),
  };
  isEditing: boolean = false;
  showError: boolean = false; // Nouvelle variable pour gérer l'affichage de l'erreur
  errorMessage: string = ''; // Nouvelle variable pour stocker le message d'erreur

  constructor() {}

  ngOnInit(): void {
    this.fetchToDos(); // Charger la liste des tâches à l'initialisation
  }

  fetchToDos(): void {
    // Ici, vous pouvez implémenter la logique pour récupérer la liste des tâches depuis le backend
    // Pour l'instant, nous utiliserons des données fictives
    this.listeToDos = [
      {
        idL: '1',
        description: 'Tâche 1',
        etat: 'En cours',
        dateCreation: new Date(),
      },
      {
        idL: '2',
        description: 'Tâche 2',
        etat: 'Terminée',
        dateCreation: new Date(),
      },
    ];
  }

  editToDo(todo: ToDo): void {
    this.isEditing = true;
    this.selectedToDo = { ...todo };
  }

  deleteToDo(id: string): void {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?');

    if (confirmation) {
      // Si l'utilisateur confirme, supprimer la tâche
      this.listeToDos = this.listeToDos.filter((todo) => todo.idL !== id);
    }
  }

  saveToDo(): void {
    if (!this.selectedToDo.etat) {
      this.showError = true;
      this.errorMessage = 'Veuillez choisir un état pour la tâche.';
      return;
    }

    this.showError = false;
    this.errorMessage = '';

    if (this.isEditing) {
      // Mise à jour de la tâche existante
      const index = this.listeToDos.findIndex(
        (todo) => todo.idL === this.selectedToDo.idL
      );
      if (index !== -1) {
        this.listeToDos[index] = this.selectedToDo;
      }
    } else {
      // Ajout d'une nouvelle tâche
      this.selectedToDo.idL = new Date().getTime().toString(); // Génération d'un ID fictif
      this.listeToDos.push(this.selectedToDo);
    }

    this.resetForm();
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedToDo = {
      idL: '',
      description: '',
      etat: '',
      dateCreation: new Date(),
    };
    this.showError = false; // Réinitialiser l'erreur au réinitialiser le formulaire
  }
}
