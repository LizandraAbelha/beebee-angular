import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ViagemAluno } from '../models/viagem-aluno';

@Injectable({
  providedIn: 'root'
})
export class ViagemAlunoService {
  private apiUrl = 'http://localhost:8080/viagens-alunos';

  constructor(private http: HttpClient) { }

  solicitar(solicitacao: ViagemAluno): Observable<ViagemAluno> {
    return this.http.post<ViagemAluno>(this.apiUrl, solicitacao);
  }

  getByViagemId(viagemId: number): Observable<ViagemAluno[]> {
    return this.http.get<ViagemAluno[]>(`${this.apiUrl}/viagem/${viagemId}`);
  }

  atualizarStatus(id: number, solicitacao: ViagemAluno): Observable<ViagemAluno> {
    return this.http.put<ViagemAluno>(`${this.apiUrl}/${id}`, solicitacao);
  }

  getByAlunoId(alunoId: number): Observable<ViagemAluno[]> {
    return this.http.get<ViagemAluno[]>(`${this.apiUrl}/aluno/${alunoId}`);
  }
}
