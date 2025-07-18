import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VeiculoService } from '../../services/veiculo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  possuiVeiculos: boolean = false;
  constructor(private veiculoService: VeiculoService) {}

  ngOnInit(): void {
    const alunoId = localStorage.getItem('aluno_id');
    if (alunoId) {
      this.veiculoService.getVeiculosPorMotorista(Number(alunoId)).subscribe(veiculos => {
        this.possuiVeiculos = veiculos.length > 0;
      });
    }
  }
}
