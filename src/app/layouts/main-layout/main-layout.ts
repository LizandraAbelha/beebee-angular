import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Notificacao } from '../../models/notificacao';
import { NotificacaoService } from '../../services/notificacao';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout implements OnInit, OnDestroy {
  nomeUsuario: string | null = '';
  alunoId: number = 0;

  notificacoes: Notificacao[] = [];
  unreadCount: number = 0;
  private notificacaoSubscription!: Subscription;

  constructor(
    private router: Router,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.nomeUsuario = localStorage.getItem('aluno_nome');
    const id = localStorage.getItem('aluno_id');
    if (id) {
      this.alunoId = Number(id);

      this.carregarNotificacoes();
      this.notificacaoSubscription = interval(30000).subscribe(() => {
        this.carregarNotificacoes();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.notificacaoSubscription) {
      this.notificacaoSubscription.unsubscribe();
    }
  }

  carregarNotificacoes(): void {
    if (this.alunoId > 0) {
      this.notificacaoService.getNotificacoes(this.alunoId).subscribe(data => {
        this.notificacoes = data;
        this.unreadCount = this.notificacoes.filter(n => !n.lida).length;
      });
    }
  }

  marcarComoLida(notificacao: Notificacao, event: Event): void {
    event.stopPropagation();
    if (!notificacao.lida) {
      this.notificacaoService.marcarComoLida(notificacao.id).subscribe(() => {
        notificacao.lida = true;
        this.unreadCount--;
      });
    }
  }

  navegarParaLink(notificacao: Notificacao): void {
    if (!notificacao.lida) {
      this.marcarComoLida(notificacao, new Event('click'));
    }
    if (notificacao.link) {
      this.router.navigate([notificacao.link]);
    }
  }

  logout() {
    localStorage.removeItem('aluno_id');
    localStorage.removeItem('aluno_nome');
    this.router.navigate(['/login']);
  }
}
