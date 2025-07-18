export interface WaterData {
  situacaoDaFatura: string;
  codigoPagamento: string;
  numeroDocumento: string;
  documentoId: string;
  idPartition: string;
  idPartition2: string;
  tipoDocumento: string;
  statusFatura: string;
  estadoSaldoPagamento: string;
  contestacao: string;
  cobrancaJuridica: boolean;
  pagamentoInformado: string;
  acordo: string;
  valor: number;
  dataVencimento: string;
  dataInicioCompetencia: string;
  dataEmissao: string;
  codigoDeBarras: string;
  linhaDigitavel: string;
  debitoAutomatico: boolean;
  numeroParcela: number;
  taxaLixo: number;
  consumo: number;
  periodoConsumo: number;
  condicaoFaturamento: string;
  dadosFatura: {
    leituraAtual: Leitura;
    leituraAnterior: Leitura;
    dataProximaLeitura: string;
  };
  discriminacaoFatura: Discriminacao[];
  calculoConta: CalculoConta[];
  valorAgua: ValorDetalhado;
  valorEsgoto: ValorDetalhado;
  // Campos adicionados para processamento
  mesAno: string;
  isoDate: string;
}

interface Leitura {
  descricao: string;
  data: string;
  valor: number;
}

interface Discriminacao {
  descricao: string;
  valor: number;
}

interface CalculoConta {
  agua: FaixaConsumo;
  esgoto: FaixaConsumo;
}

interface FaixaConsumo {
  faixa: string;
  consumo: string;
  aguaTarifa: number;
  valor: number;
}

interface ValorDetalhado {
  valor: number;
  multiplo: number;
  valorTotal: number;
}
