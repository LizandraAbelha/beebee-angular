import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VeiculoService } from '../../services/veiculo';
import { RouterLink } from '@angular/router';
import { Veiculo } from '../../models/veiculo'; // <-- Importa o nosso novo modelo

@Component({
  selector: 'app-veiculo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './veiculo-list.html',
  styleUrls: ['./veiculo-list.css']
})
export class VeiculoList implements OnInit {
  // A lista de veículos agora é um array do tipo Veiculo
  veiculos: Veiculo[] = [];

  constructor(private veiculoService: VeiculoService) { }

  ngOnInit(): void {
    const alunoId = localStorage.getItem('aluno_id');
    if (alunoId) {
      this.veiculoService.getVeiculosPorMotorista(Number(alunoId)).subscribe(data => {
        this.veiculos = data;
      });
    }
  }
}
