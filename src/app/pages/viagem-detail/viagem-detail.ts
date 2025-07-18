import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViagemService } from '../../services/viagem';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { Viagem } from '../../models/viagem';
import { ViagemAluno } from '../../models/viagem-aluno';

@Component({
  selector: 'app-viagem-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './viagem-detail.html',
  styleUrl: './viagem-detail.css'
})
export class ViagemDetail implements OnInit {
  viagem: Viagem | null = null;
  alunoLogadoId: number = 0;
  pedidos: ViagemAluno[] = [];
  isMotorista: boolean = false;
  minhaSolicitacao: ViagemAluno | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private router: Router,
    private viagemAlunoService: ViagemAlunoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const alunoId = localStorage.getItem('aluno_id');

    if (alunoId) {
      this.alunoLogadoId = Number(alunoId);
    } else {
      this.router.navigate(['/login']);
      return;
    }

    if (id) {
      const viagemId = Number(id);

      this.viagemService.getById(Number(id)).subscribe(data => {
        this.viagem = data;
        console.log('Detalhes da viagem carregados:', this.viagem);

        this.isMotorista = this.alunoLogadoId === this.viagem.motoristaId;
        console.log('Este usuário é o motorista?', this.isMotorista);

        if (this.isMotorista) {
          this.carregarPedidos(viagemId);
        }
      });
    }
  }

  carregarDetalhesViagem(id: number): void {
    this.viagemService.getById(id).subscribe(data => {
      this.viagem = data;
      this.isMotorista = this.alunoLogadoId === this.viagem.motoristaId;
      this.carregarPedidos(id);
    });
  }

  carregarPedidos(viagemId: number): void {
    this.viagemAlunoService.getByViagemId(viagemId).subscribe(pedidos => {
      this.pedidos = pedidos;
      this.minhaSolicitacao = this.pedidos.find(p => p.alunoId === this.alunoLogadoId);
    });
  }

  gerirPedido(pedido: ViagemAluno, novoStatus: 'CONFIRMADA' | 'CANCELADA'): void {
    if (!this.viagem) return;
    const pedidoAtualizado = { ...pedido, situacao: novoStatus };
    this.viagemAlunoService.atualizarStatus(pedido.id!, pedidoAtualizado).subscribe(() => {
      alert(`Pedido ${novoStatus === 'CONFIRMADA' ? 'aprovado' : 'recusado'} com sucesso!`);
      this.carregarPedidos(this.viagem!.id!);
    });
  }

  solicitarParticipacao() {
    if (!this.viagem) return;

    const novaSolicitacao: ViagemAluno = {
      dataSolicitacao: new Date().toISOString(),
      situacao: 'SOLICITADA',
      alunoId: this.alunoLogadoId,
      viagemId: this.viagem.id!,
      viagem: this.viagem
    };

    this.viagemAlunoService.solicitar(novaSolicitacao).subscribe({
      next: () => {
        alert('Participação solicitada com sucesso!');
        this.carregarPedidos(this.viagem!.id!);
      },
      error: (err) => {
        console.error('Erro ao solicitar participação:', err);
        alert(`Erro: ${err.error.message || err.error}`);
      }
    });
  }

  finalizarViagem(pedido: ViagemAluno): void {
    if (!confirm('Tem a certeza de que deseja finalizar esta boleia para este passageiro?')) {
      return;
    }

    const pedidoFinalizado: ViagemAluno = { ...pedido, situacao: 'FINALIZADA' };

    this.viagemAlunoService.atualizarStatus(pedido.id!, pedidoFinalizado).subscribe(() => {
      alert('Boleia finalizada com sucesso!');
      this.carregarPedidos(this.viagem!.id!);
    });
  }

  encerrarViagem(): void {
    if (!this.viagem || !confirm('Tem a certeza de que deseja encerrar esta viagem para todos? Ninguém mais poderá solicitar participação.')) {
      return;
    }

    const viagemAtualizada = { ...this.viagem, situacao: 'FINALIZADA' };

    this.viagemService.update(this.viagem.id!, viagemAtualizada).subscribe(viagemAtualizadaDoServidor => {
      this.viagem = viagemAtualizadaDoServidor;
      alert('Viagem encerrada com sucesso!');
    });
  }
}
