export interface DealernetVehicleResponse {
  Veiculo: number;
  VeiculoPlaca: string;
  VeiculoChassi: string;
  VeiculoAno_Codigo: number;
  VeiculoModelo_Codigo: number;
  VeiculoModelo_Descricao: string;
  VeiculoFamilia_Descricao: string;
  VeiculoMarca_Codigo: number;
  VeiculoMarca_Descricao: string;
  Veiculo_CorExterna: number;
  Veiculo_CorExternaDescricao: string;
  Veiculo_CorExternaTipo: string;
  Veiculo_CorExternaRenavam: string;
  Veiculo_CorInterna: number;
  Veiculo_CorInternaDescricao: string;
  Veiculo_Km: number;
  Veiculo_DataAtualizacaoKm: string;
  Veiculo_KmMedio: number;
  Veiculo_NumeroRenavam: number;
  Veiculo_Combustivel: string;
  Veiculo_Transmissao: string;
  Veiculo_Tipo: string;
  Veiculo_DataVenda: string;
  Veiculo_DataEntrega: string;
  Veiculo_DataExpiracaoGarantia: string;
  Veiculo_NumeroMotor: string;
  Cliente: number;
  ClienteDocumento: number;
  ClienteNome: string;
  VendedorNome: string;
  Mensagem: string;
}

export interface DealernetVehicleYearResponse {
  Ano_Codigo: number;
  Ano_Fabricacao: string;
  Ano_Modelo: string;
  Mensagem: string;
}
