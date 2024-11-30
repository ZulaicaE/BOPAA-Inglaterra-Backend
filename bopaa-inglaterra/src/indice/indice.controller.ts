import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { IndiceService } from './indice.service';

@Controller('indices')
export class IndiceController {
  constructor(private readonly indiceService: IndiceService) { }


  @Get('/:codigoBolsa/cotizaciones')
  async getIndicesBolsa(
    @Param('codigoBolsa') codigoBolsa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ): Promise<any> {
    return await this.indiceService.getIndicesBolsa(
      codigoBolsa,
      fechaDesde,
      fechaHasta,
    );
  }

  @Post('')
  async postearBolsa(
    @Body() body: { code: string, name: string }): Promise<any> {
    return this.indiceService.postearBolsar(body);
  }

  @Post('/:codigoBolsa/cotizaciones')
  async postearCotizaciones(
    @Param('codigoBolsa') codigoBolsa: string) {
    return this.indiceService.postearCotizaciones(codigoBolsa);
  }

  @Put('/actualizar')
  async actualizarIndicesBursatiles() {
    return this.indiceService.actualizarIndicesBursatiles();
  }
}
