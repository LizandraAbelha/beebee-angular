import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VeiculoService } from '../../services/veiculo';
import { Veiculo } from '../../models/veiculo'; // <-- Importa o nosso novo modelo

@Component({
  selector: 'app-veiculo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veiculo-form.html',
  styleUrls: ['./veiculo-form.css']
})
export class VeiculoForm {
  veiculo: Veiculo = {
    placa: '',
    modelo: '',
    cor: '',
    motoristaId: Number(localStorage.getItem('aluno_id'))
  };

  constructor(
    private veiculoService: VeiculoService,
    private router: Router
  ) {}

  salvarVeiculo() {
    this.veiculoService.salvar(this.veiculo).subscribe(() => {
      alert('Veículo salvo com sucesso!');
      this.router.navigate(['/app/veiculos']);
    });
  }
}
