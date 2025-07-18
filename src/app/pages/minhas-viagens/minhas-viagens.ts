import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Viagem } from '../../models/viagem';
import { ViagemAluno } from '../../models/viagem-aluno';
import { ViagemService } from '../../services/viagem';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-minhas-viagens',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './minhas-viagens.html',
  styleUrl: './minhas-viagens.css'
})
export class MinhasViagens implements OnInit {
  viagensComoMotorista: Viagem[] = [];
  viagensComoPassageiro: ViagemAluno[] = [];
  alunoLogadoId: number = 0;

  constructor(
    private viagemService: ViagemService,
    private viagemAlunoService: ViagemAlunoService
  ) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    if (this.alunoLogadoId) {
      console.log('--- Depurando Minhas Caronas ---');
      this.carregarViagensMotorista();
      this.carregarViagensPassageiro();
    }
  }

  carregarViagensMotorista(): void {
    this.viagemService.getByMotoristaId(this.alunoLogadoId).subscribe(data => {
      console.log('API retornou para Motorista:', data);
      this.viagensComoMotorista = data;
    });
  }

  carregarViagensPassageiro(): void {
    this.viagemAlunoService.getByAlunoId(this.alunoLogadoId).subscribe(data => {
      console.log('API retornou para Passageiro:', data);
      this.viagensComoPassageiro = data;
    });
  }

}
