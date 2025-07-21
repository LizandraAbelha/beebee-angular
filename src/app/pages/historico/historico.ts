import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViagemAluno } from '../../models/viagem-aluno';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './historico.html',
  styleUrl: './historico.css'
})
export class Historico implements OnInit {
  viagensFinalizadas: ViagemAluno[] = [];
  alunoLogadoId: number = 0;

  constructor(private viagemAlunoService: ViagemAlunoService) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    if (this.alunoLogadoId) {
      this.carregarHistorico();
    }
  }

  carregarHistorico(): void {
    this.viagemAlunoService.getByAlunoId(this.alunoLogadoId).subscribe(data => {
      this.viagensFinalizadas = data.filter(
        v => v.situacao === 'FINALIZADA' || v.situacao === 'CANCELADA'
      );
    });
  }

  avaliar(viagemAluno: ViagemAluno): void {
    alert(`Avaliar viagem com ${viagemAluno.viagem.motoristaNome}`);
  }
}
