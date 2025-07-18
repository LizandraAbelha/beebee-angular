import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViagemService } from '../../services/viagem';
import { Viagem } from '../../models/viagem';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-viagem-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './viagem-list.html',
  styleUrls: ['./viagem-list.css']
})
export class ViagemList implements OnInit {
  viagens: Viagem[] = [];

  constructor(private viagemService: ViagemService) {}

  ngOnInit(): void {
    this.viagemService.getAll().subscribe(data => {
      this.viagens = data;
      console.log('Viagens carregadas:', this.viagens);
    });
  }
}
