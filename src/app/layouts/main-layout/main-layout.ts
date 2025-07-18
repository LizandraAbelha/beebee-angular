import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout implements OnInit {
  nomeUsuario: string | null = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nomeUsuario = localStorage.getItem('aluno_nome');
  }

  logout() {
    localStorage.removeItem('aluno_id');
    localStorage.removeItem('aluno_nome');

    this.router.navigate(['/login']);
  }
}
