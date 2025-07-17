export interface EnergyData {
  mesAno: string;
  medidor: string;
  descricao: string;
  dataLeitura: string;
  constante: number;
  leituraAtiva: number;
  consumoAtivoKwh: number;
  numDiasFaturamento: number;
  mediaAtivaKwhDia: number;
  mediaConsumo: number;
  tipoFaturamento: string;
  totalFatura: number;
  leituraDate: Date;
  isoDate: string; // Adicionado para ordenação
}
