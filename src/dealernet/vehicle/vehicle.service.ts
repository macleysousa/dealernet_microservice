/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

import { dealernet } from 'src/commons/web-client';
import { IntegrationDealernet } from 'src/petroplay/integration/entities/integration.entity';

import { CreateDealernetVehicleDTO } from './dto/create-vehicle.dto';
import { VehicleFilter } from './filters/vehicle.filter';
import { VehicleYearFilter } from './filters/vehicle-year.filter';
import { DealernetVehicleResponse, DealernetVehicleYearResponse } from './response/vehicle.response';

@Injectable()
export class DealernetVehicleService {
  async find(connection: IntegrationDealernet, filter: VehicleFilter): Promise<DealernetVehicleResponse[]> {
    const url = `${connection.url}/aws_fastserviceapi.aspx`;

    const xmlBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:deal="DealerNet">
            <soapenv:Header/>
            <soapenv:Body>
                <deal:WS_FastServiceApi.VEICULO>
                    <deal:Usuario>${connection.user}</deal:Usuario>
                    <deal:Senha>${connection.key}</deal:Senha>
                    <deal:Sdt_fsveiculoin>
                        <deal:Veiculo_Placa>${filter?.license_plate ?? '?'}</deal:Veiculo_Placa>
                        <deal:Veiculo_Chassi>${filter?.chassi ?? '?'}</deal:Veiculo_Chassi>
                        <deal:Acao>LST</deal:Acao>
                    </deal:Sdt_fsveiculoin>
                </deal:WS_FastServiceApi.VEICULO>
            </soapenv:Body>
        </soapenv:Envelope>
        `;
    try {
      const client = await dealernet();

      const response = await client.post(url, xmlBody).then(({ data }) =>
        new XMLParser().parse(data)['SOAP-ENV:Envelope']['SOAP-ENV:Body']['WS_FastServiceApi.VEICULOResponse']['Sdt_fsveiculoout']['SDT_FSVeiculoOut']);

      const vehicles = Array.isArray(response) ? response : [response];
      if (vehicles.filter((vehicle) => vehicle.Mensagem).length > 0) return [];

      return vehicles
    } catch (error) {
      Logger.error('Erro ao fazer a requisição:', error, 'DealernetVehicleService.findByPlate');
      throw error;
    }
  }

  async findByPlate(connection: IntegrationDealernet, plate: string): Promise<DealernetVehicleResponse> {
    return this.find(connection, { license_plate: plate }).then((vehicle) => vehicle?.first());
  }

  async findYears(connection: IntegrationDealernet, filter: VehicleYearFilter): Promise<DealernetVehicleYearResponse[]> {
    const url = `${connection.url}/aws_fastserviceapi.aspx`;

    const xmlBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:deal="DealerNet">
            <soapenv:Header/>
            <soapenv:Body>
                <deal:WS_FastServiceApi.ANOMODELO>
                    <deal:Usuario>${connection.user}</deal:Usuario>
                    <deal:Senha>${connection.key}</deal:Senha>
	                  <deal:Sdt_fsanomodeloin>
				              <deal:Ano_Codigo>${filter?.year_code ?? '?'}</deal:Ano_Codigo>
				              <deal:Ano_Fabricacao>${filter?.year_fabrication ?? '?'}</deal:Ano_Fabricacao>
				              <deal:Ano_Modelo>${filter?.year_model ?? '?'}</deal:Ano_Modelo>
			              </deal:Sdt_fsanomodeloin>
                </deal:WS_FastServiceApi.ANOMODELO>
            </soapenv:Body>
        </soapenv:Envelope>
        `;

    try {
      const client = await dealernet();

      const response = await client.post(url, xmlBody).then(({ data }) =>
        new XMLParser().parse(data)['SOAP-ENV:Envelope']['SOAP-ENV:Body']['WS_FastServiceApi.ANOMODELOResponse']['Sdt_fsanomodeloout']['SDT_FSAnoModeloOut']);

      const years = Array.isArray(response) ? response : [response];
      if (years.filter((year) => year.Mensagem).length > 0) return [];

      return years;
    } catch (error) {
      Logger.error('Erro ao fazer a requisição:', error, 'DealernetVehicleService.findYears');
      throw error
    }
  }

  async create(connection: IntegrationDealernet, dto: CreateDealernetVehicleDTO): Promise<DealernetVehicleResponse> {
    const url = `${connection.url}/aws_fastserviceapi.aspx`;

    const xmlBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:deal="DealerNet">
            <soapenv:Header/>
            <soapenv:Body>
                <deal:WS_FastServiceApi.VEICULO>
                    <deal:Usuario>${connection.user}</deal:Usuario>
                    <deal:Senha>${connection.key}</deal:Senha>
                    <deal:Sdt_fsveiculoin>
                        <deal:Veiculo_Placa>${dto.Veiculo_Placa}/deal:Veiculo_Placa>
                        <deal:Veiculo_Chassi>${dto.Veiculo_Chassi ?? '?'}</deal:Veiculo_Chassi>
                        <deal:VeiculoAno_Codigo>${dto.Veiculo_AnoCodigo ?? '?'}</deal:VeiculoAno_Codigo>
                        <deal:Veiculo_Modelo>${dto.Veiculo_Modelo ?? '?'}</deal:Veiculo_Modelo>
                        <deal:Veiculo_CorExterna>${dto.Veiculo_CorExterna ?? '?'}</deal:Veiculo_CorExterna>
                        <deal:Veiculo_Km>${dto.Veiculo_Km ?? '?'}</deal:Veiculo_Km>
                        <deal:Veiculo_DataVenda>${dto.Veiculo_DataVenda ?? '?'}</deal:Veiculo_DataVenda>
                        <deal:Veiculo_NumeroMotor>${dto.Veiculo_NumeroMotor ?? '?'}</deal:Veiculo_NumeroMotor>
                        <deal:Cliente_Documento>${dto.Cliente_Documento ?? '?'}</deal:Cliente_Documento>
                        <deal:Acao>INC</deal:Acao>
                    </deal:Sdt_fsveiculoin>
                </deal:WS_FastServiceApi.VEICULO>
            </soapenv:Body>
        </soapenv:Envelope>
        `;
    try {
      const client = await dealernet();
      const response = await client.post(url, xmlBody);
      const xmlData = response.data;
      const parser = new XMLParser();
      const parsedData = parser.parse(xmlData);
      const vehicle: DealernetVehicleResponse =
        parsedData['SOAP-ENV:Envelope']['SOAP-ENV:Body']['WS_FastServiceApi.VEICULOResponse']['Sdt_fsveiculoout']['SDT_FSVeiculoOut'];
      if (vehicle.Mensagem) {
        throw new BadRequestException(vehicle.Mensagem);
      }
      return vehicle;
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      throw error;
    }
  }
}
