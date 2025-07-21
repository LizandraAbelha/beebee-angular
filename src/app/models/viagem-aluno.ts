import { Viagem } from "./viagem";

export interface ViagemAluno {
  id?: number;
  dataSolicitacao: string;
  dataConfirmacao?: string;
  observacao?: string;
  situacao: 'SOLICITADA' | 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA' | 'FINALIZADA';
  alunoId: number;
  alunoNome?: string;
  viagem: Viagem;
}
