import { Component, OnInit } from '@angular/core';
import { PersonneService } from '../service/personne.service';
import { Personne } from '../service/personne.model';

@Component({
  selector: 'app-achat',
  templateUrl: './achat.component.html',
  styleUrls: ['./achat.component.css'],
})
export class AchatComponent implements OnInit {
  personnes: Personne[] = [];
  listPer: any;

  constructor(private personneService: PersonneService) {}

  ngOnInit(): void {
    console.log('Personneliste');
    this.personneService.getPersonnes().subscribe((res) => {
      this.listPer = res as any;
      console.log('Personeeeeee', this.listPer.values);
    });
  }
}
