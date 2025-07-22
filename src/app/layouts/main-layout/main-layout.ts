import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Aluno } from '../../models/aluno';
import { AlunoService } from '../../services/aluno';
import { Notificacao } from '../../models/notificacao';
import { NotificacaoService } from '../../services/notificacao';
import { Subscription, interval } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout implements OnInit, OnDestroy {
  aluno: Aluno | null = null;
  notificacoes: Notificacao[] = [];
  unreadCount: number = 0;
  private notificacaoSubscription!: Subscription;
  private sidebarSubscription!: Subscription;
  isSidebarOpen = false;

  public environment = environment;

  constructor(
    private router: Router,
    private alunoService: AlunoService,
    private notificacaoService: NotificacaoService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.toggle$.subscribe(() => {
      this.isSidebarOpen = !this.isSidebarOpen;
    });

    const id = localStorage.getItem('aluno_id');
    if (id) {
      const alunoId = Number(id);
      this.alunoService.getById(alunoId).subscribe(data => {
        this.aluno = data;
      });
      this.carregarNotificacoes(alunoId);
      this.notificacaoSubscription = interval(30000).subscribe(() => {
        this.carregarNotificacoes(alunoId);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.notificacaoSubscription) {
      this.notificacaoSubscription.unsubscribe();
    }
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  closeSidebar(): void {
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // A função agora pega o nome diretamente do objeto 'aluno'
  getIniciais(): string {
    const nome = this.aluno?.nome;
    if (!nome) return '';
    const nomes = nome.split(' ').filter(Boolean);
    if (nomes.length === 0) return '';
    const primeiroNome = nomes[0];
    const ultimoNome = nomes.length > 1 ? nomes[nomes.length - 1] : '';
    const primeiraLetra = primeiroNome[0];
    const ultimaLetra = ultimoNome ? ultimoNome[0] : '';
    return `${primeiraLetra}${ultimaLetra}`.toUpperCase();
  }

  carregarNotificacoes(alunoId: number): void {
    if (alunoId > 0) {
      this.notificacaoService.getNotificacoes(alunoId).subscribe(data => {
        this.notificacoes = data;
        this.unreadCount = this.notificacoes.filter(n => !n.lida).length;
      });
    }
  }

  marcarComoLida(notificacao: Notificacao, event: Event): void { /* ...código original... */ }
  navegarParaLink(notificacao: Notificacao): void { /* ...código original... */ }

  logout() {
    this.toggleSidebar();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
