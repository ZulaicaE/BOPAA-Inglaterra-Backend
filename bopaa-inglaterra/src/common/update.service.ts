import { Injectable, Logger, } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BolsaService } from 'src/bolsa/bolsa.service';
import { EmpresaService } from 'src/empresas/empresa.service';
import { IndiceService } from 'src/indice/indice.service';

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);
  constructor(
    private readonly bolsaService: BolsaService,
    private readonly empresaService: EmpresaService,
    private readonly indiceService: IndiceService,
  ) { }
  
  async onModuleInit() {

    const misEmpresas: string[] = ['AAPL', 'TSLA', 'JPM', 'ROG.SW', 'SHEL', 'TM', 'PEP'];

    this.logger.log('Actualizando Bolsas');
    await this.bolsaService.actualizarBolsas();
    this.logger.log('Actualizancion de Bolsas completada');

    this.logger.log('Verificando Empresas');
    for (const empresa of misEmpresas) {
      await this.empresaService.agregarEmpresa(empresa);
    }
    this.logger.log('Empresas Verificadas');

    this.logger.log('Actualizando cotizaciones');
    await this.empresaService.actualizarCotizaciones();
    this.logger.log('Actualizancion de cotizaciones completada');
    
    this.logger.log('Actualizando Indices');
    await this.indiceService.actualizarIndicesBursatiles();
    this.logger.log('Actualizancion de Indices completada');

    this.logger.log('Posteando Indices');
    const codigoBolsa: string = 'LSE';
    await this.indiceService.postearCotizaciones(codigoBolsa);
    this.logger.log('Posteo de Indices completado');
  }

  @Cron('5 6-12 * * 1-5') // a los 5 minutos de cada hora de 9 a 15 UTC0 de lunes a viernes.
  async actualizarCotizacionesHorario() {
    this.logger.log('Actualizacion horaria de cotizaciones');
    await this.empresaService.actualizarCotizaciones();
    this.logger.log('Actualizancion horaria de cotizaciones completada');
  }

  @Cron('10 6-12 * * 1-5') // a los 10 minutos de cada hoora de 9 a 15 UTC0 de lunes a viernes.
  async actualizarIndicesHorario() {
    this.logger.log('Actualizacion horaria de indices');
    await this.indiceService.actualizarIndicesBursatiles();
    this.logger.log('Actualizancion horaria de indices completada');

    this.logger.log('Posteo de nuevos indices');
    const codigoBolsa: string = 'LSE';
    await this.indiceService.postearCotizaciones(codigoBolsa);
    this.logger.log('Posteo de nuevos indices completado');
  }
}

