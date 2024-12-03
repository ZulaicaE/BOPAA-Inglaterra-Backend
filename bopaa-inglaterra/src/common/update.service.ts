import { Injectable, } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BolsaService } from 'src/bolsa/bolsa.service';
import { EmpresaService } from 'src/empresas/empresa.service';
import { IndiceService } from 'src/indice/indice.service';

@Injectable()
export class UpdateService {
  constructor(
    private readonly bolsaService: BolsaService,
    private readonly empresaService: EmpresaService,
    private readonly indiceService: IndiceService,
  ) { }

  
  async onModuleInit() {
    console.log('Actualizando Bolsas');
    await this.bolsaService.actualizarBolsas();
    console.log('Actualizando cotizaciones');
    await this.empresaService.actualizarCotizaciones();
    console.log('Actualizando Indices');
    await this.indiceService.actualizarIndicesBursatiles();
  }

  @Cron('5 6-12 * * 1-5') // a los 5 minutos de cada hora de 9 a 15 UTC0 de lunes a viernes.
  async actualizarCotizacionesHorario() {
    console.log('Actualizacion horaria de cotizaciones');
    await this.empresaService.actualizarCotizaciones();
  }

  @Cron('10 6-12 * * 1-5') // a los 10 minutos de cada hoora de 9 a 15 UTC0 de lunes a viernes.
  async actualizarIndicesHorario() {
    console.log('Actualizacion horaria de indices');
    await this.indiceService.actualizarIndicesBursatiles();
    console.log('Posteo de nuevos indices');
    const codigoBolsa: string = 'LSE';
    await this.indiceService.postearCotizaciones(codigoBolsa);
  }
}

