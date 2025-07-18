import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ViagemService } from '../../services/viagem';
import { Viagem } from '../../models/viagem';

@Component({
  selector: 'app-viagem-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viagem-form.html',
  styleUrls: ['./viagem-form.css']
})
export class ViagemForm {
  viagem: Viagem = {
    descricao: '',
    dataInicio: '',
    dataFim: '',
    origem: '',
    destino: '',
    situacao: 'PLANEJADA',
    motoristaId: Number(localStorage.getItem('aluno_id'))
  };

  constructor(
    private viagemService: ViagemService,
    private router: Router
  ) {}

  salvarViagem() {
    this.viagemService.salvar(this.viagem).subscribe({
      next: () => {
        alert('Viagem criada com sucesso!');
        this.router.navigate(['/app/home']);
      },
      error: (err) => {
        console.error('Erro ao criar viagem:', err);
        alert('Ocorreu um erro ao criar a viagem. Verifique a consola.');
      }
    });
  }
}
