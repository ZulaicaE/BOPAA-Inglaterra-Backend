import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { BolsaService } from './bolsa.service';

@Controller('Bolsas')
export class BolsaController {
  constructor(private readonly bolsaService: BolsaService) {}

  @Get('')
  async getBolsas() {
    return await this.bolsaService.getBolsas();
  }

  @Get('/:codigoBolsa/indices')
  async getIndicesBolsa(
    @Param('codigoBolsa') codigoBolsa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ): Promise<any> {
    return await this.bolsaService.getIndicesBolsa(
      codigoBolsa,
      fechaDesde,
      fechaHasta,
    );
  }

  @Put('/actualizar')
  async actualizarBolsas() {
    return await this.bolsaService.actualizarBolsas();
  }
}