import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { VeiculoService } from '../../services/veiculo';
import { SidebarService } from '../../services/sidebar';
import { ViagemAluno } from '../../models/viagem-aluno';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { Aluno } from '../../models/aluno';
import { AlunoService } from '../../services/aluno';
import { Veiculo } from '../../models/veiculo';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit {

  possuiVeiculos: boolean = false;
  filtroOrigem: string = '';
  filtroDestino: string = '';
  filtroData: string = '';

  viagemEmDestaque: ViagemAluno | null = null;
  motoristaDoDestaque: Aluno | null = null;
  veiculoDoDestaque: Veiculo | null = null;

  public environment = environment;
  @ViewChild('map') divMap!: ElementRef;

  constructor(
    private veiculoService: VeiculoService,
    private router: Router,
    private viagemAlunoService: ViagemAlunoService,
    private alunoService: AlunoService
  ) {}

  ngOnInit(): void {
    const alunoId = localStorage.getItem('aluno_id');
    console.log("1. Verificando Home. ID do aluno no localStorage:", alunoId); // LOG 1
    if (alunoId) {
      this.verificarViagensAtivas(Number(alunoId));
      this.veiculoService.getVeiculosPorMotorista(Number(alunoId)).subscribe(veiculos => {
        this.possuiVeiculos = veiculos.length > 0;
      });
    }
  }

  verificarViagensAtivas(alunoId: number): void {
    console.log("2. Buscando viagens para o aluno ID:", alunoId); // LOG 2
    this.viagemAlunoService.getByAlunoId(alunoId).subscribe(viagens => {
      console.log("3. Viagens encontradas:", viagens); // LOG 3

      const viagemAtiva = viagens.find(v => ['EM_ANDAMENTO', 'CONFIRMADA', 'SOLICITADA'].includes(v.situacao));

      if (viagemAtiva) {
        this.viagemEmDestaque = viagemAtiva;
      } else {
        const viagemParaAvaliar = viagens.find(v => v.situacao === 'FINALIZADA' && !v.avaliacao);
        this.viagemEmDestaque = viagemParaAvaliar || null;
      }

      console.log("4. Viagem em destaque selecionada:", this.viagemEmDestaque); // LOG 4

      if (this.viagemEmDestaque) {
        const motoristaId = this.viagemEmDestaque.viagem.motoristaId;
        console.log("5. Viagem encontrada! Buscando dados do motorista ID:", motoristaId); // LOG 5

        this.alunoService.getById(motoristaId).subscribe(motorista => {
          this.motoristaDoDestaque = motorista;
          console.log("6. Dados do motorista encontrados:", this.motoristaDoDestaque); // LOG 6
        });

        this.veiculoService.getVeiculosPorMotorista(motoristaId).subscribe(veiculos => {
          if (veiculos && veiculos.length > 0) {
            this.veiculoDoDestaque = veiculos[0];
            console.log("7. Veículo do motorista encontrado:", this.veiculoDoDestaque); // LOG 7
          } else {
            console.log("7. Nenhum veículo encontrado para o motorista."); // LOG 7.1
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    setTimeout(() => {
      if (this.divMap?.nativeElement) {
        const apiKey = environment.locationiqToken;

        if (!apiKey || apiKey === 'COLE_SEU_TOKEN_AQUI') {
          console.error('Token do LocationIQ não configurado em environment.ts');
          return;
        }

        const styleUrl = `https://tiles.locationiq.com/v3/streets/vector.json?key=${apiKey}`;

        const map = new maplibregl.Map({
          container: this.divMap.nativeElement,
          style: styleUrl,
          center: [-42.6281, -19.5186],
          zoom: 14,
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
      }
    }, 0);
  }

  procurarViagens(): void {
    this.router.navigate(['/app/viagens'], {
      queryParams: {
        origem: this.filtroOrigem,
        destino: this.filtroDestino,
        data: this.filtroData
      }
    });
  }

  getIniciais(nome: string | undefined): string {
    if (!nome) {
      return '';
    }
    const nomes = nome.split(' ').filter(Boolean);
    if (nomes.length === 0) {
      return '';
    }

    const primeiraLetra = nomes[0][0] || '';
    const ultimoNome = nomes[nomes.length - 1];
    const ultimaLetra = ultimoNome[0] || '';

    return nomes.length > 1 ? `${primeiraLetra}${ultimaLetra}`.toUpperCase() : primeiraLetra.toUpperCase();
  }

}
