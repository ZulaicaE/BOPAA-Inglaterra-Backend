import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { BolsaService } from './bolsa.service';

@Controller('bolsas')
export class BolsaController {
  constructor(private readonly bolsaService: BolsaService) {}

  @Get('')
  async getBolsas() {
    return await this.bolsaService.getBolsas();
  }

  @Get('/:codigoBolsa/details')
  async getBolsaByCodigo(
  @Param(('codigoBolsa')) codigoBolsa: string) {
      return await this.bolsaService.getBolsaByCodigo(codigoBolsa);
  }

  @Put('/actualizar')
  async actualizarBolsas() {
    return await this.bolsaService.actualizarBolsas();
  }
}