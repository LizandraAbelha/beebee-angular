import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  // A URL base da sua API. O Spring por padrão roda na porta 8080.
  private apiUrl = 'http://localhost:8080/alunos';

  constructor(private http: HttpClient) { }

  // O tipo 'any' é usado aqui por simplicidade, podemos tipar depois com os DTOs.
  cadastrar(aluno: any): Observable<any> {
    return this.http.post(this.apiUrl, aluno);
  }
  login(credenciais: any): Observable<any> {
    return this.http.post('http://localhost:8080/alunos/autenticar', credenciais);
  }
}
