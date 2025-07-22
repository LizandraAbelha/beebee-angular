import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HorarioAcademicoService } from '../../services/horario-academico';
import { HorarioAcademico } from '../../models/horario-academico';

@Component({
  selector: 'app-horario-academico-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './horario-academico-list.html'
})
export class HorarioAcademicoList implements OnInit {
  horarios: HorarioAcademico[] = [];

  constructor(private horarioService: HorarioAcademicoService) {}

  ngOnInit(): void {
    const alunoId = Number(localStorage.getItem('aluno_id'));
    if (alunoId) {
      this.horarioService.getByAlunoId(alunoId).subscribe(data => {
        this.horarios = data;
      });
    }
  }
}
