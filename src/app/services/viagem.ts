import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Viagem } from '../models/viagem';

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  private apiUrl = 'http://localhost:8080/viagens';

  constructor(private http: HttpClient) { }

  salvar(viagem: Viagem): Observable<Viagem> {
    return this.http.post<Viagem>(this.apiUrl, viagem);
  }

  getAll(): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(this.apiUrl);
  }

  getById(id: number): Observable<Viagem> {
    return this.http.get<Viagem>(`${this.apiUrl}/${id}`);
  }

  getByMotoristaId(motoristaId: number): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.apiUrl}/motorista/${motoristaId}`);
  }

  update(id: number, viagem: Viagem): Observable<Viagem> {
    return this.http.put<Viagem>(`${this.apiUrl}/${id}`, viagem);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
