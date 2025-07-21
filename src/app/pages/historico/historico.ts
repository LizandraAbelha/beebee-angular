import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViagemAluno } from '../../models/viagem-aluno';
import { Viagem } from '../../models/viagem';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { ViagemService } from '../../services/viagem';
import { VeiculoService } from '../../services/veiculo';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './historico.html',
  styleUrl: './historico.css'
})
export class Historico implements OnInit {
  historicoMotorista: Viagem[] = [];
  historicoPassageiro: ViagemAluno[] = [];
  alunoLogadoId: number = 0;
  isMotorista: boolean = false;

  constructor(
    private viagemService: ViagemService,
    private viagemAlunoService: ViagemAlunoService,
    private veiculoService: VeiculoService
  ) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    if (this.alunoLogadoId) {
      this.verificarSeEhMotorista();
      this.carregarHistoricoPassageiro();
    }
  }

  verificarSeEhMotorista(): void {
    this.veiculoService.getVeiculosPorMotorista(this.alunoLogadoId).subscribe(veiculos => {
      this.isMotorista = veiculos.length > 0;
      if (this.isMotorista) {
        this.carregarHistoricoMotorista();
      }
    });
  }

  carregarHistoricoMotorista(): void {
    this.viagemService.getHistoricoByMotoristaId(this.alunoLogadoId).subscribe(data => {
      this.historicoMotorista = data;
    });
  }

  carregarHistoricoPassageiro(): void {
    this.viagemAlunoService.getByAlunoId(this.alunoLogadoId).subscribe(data => {
      this.historicoPassageiro = data.filter(item => {
        const viagemPrincipalTerminou = item.viagem.situacao === 'FINALIZADA' || item.viagem.situacao === 'CANCELADA';

        const suaParticipacaoTerminou = item.situacao === 'FINALIZADA' || item.situacao === 'CANCELADA';

        return viagemPrincipalTerminou || suaParticipacaoTerminou;
      });
    });
  }

  avaliar(viagemAluno: ViagemAluno): void {
    alert(`Redirecionando para avaliar a viagem com ${viagemAluno.viagem.motoristaNome}`);
  }
}
