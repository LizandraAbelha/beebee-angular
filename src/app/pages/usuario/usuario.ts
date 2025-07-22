import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlunoService } from '../../services/aluno';
import { Aluno } from '../../models/aluno';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuario.html'
})
export class UsuarioComponent implements OnInit {
  aluno: Aluno = {
    nome: '',
    cpf: '',
    email: '',
    login: '',
    senha: ''
  };

  editando = false;

  constructor(
    private alunoService: AlunoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const alunoId = Number(localStorage.getItem('aluno_id'));
    if (alunoId) {
      this.alunoService.getById(alunoId).subscribe(data => {
        this.aluno = data;
      });
    }
  }

  editar() {
    this.editando = true;
  }

  cancelar() {
    this.editando = false;
    const alunoId = Number(localStorage.getItem('aluno_id'));
    if (alunoId) {
      this.alunoService.getById(alunoId).subscribe(data => {
        this.aluno = data;
      });
    }
  }

  salvar(): void {
    if (this.aluno.id) {
      this.alunoService.update(this.aluno.id, this.aluno).subscribe(() => {
        alert('Informações atualizadas!');
        this.editando = false;
      });
    }
  }

deletar(): void {
  console.log('Tentando deletar aluno com id:', this.aluno.id);
  if (this.aluno.id && confirm('Tem certeza que quer deletar sua conta?')) {
    this.alunoService.delete(this.aluno.id).subscribe({
      next: () => {
        alert('Conta deletada.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro ao deletar conta:', err);
        alert('Erro ao deletar conta, veja o console.');
      }
    });
  } else {
    alert('ID do aluno não encontrado.');
  }
}
}
