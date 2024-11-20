import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { Empresa } from './entities/empresa.entity';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) { }

  @Get('')
  async getEmpresas() {
    return await this.empresaService.getEmpresas();
  }

  @Get('/:codigoEmpresa/details')
  async getDetallesEmpresa(
    @Param('codigoEmpresa') codigoEmpresa: string,): Promise<any> {
    return await this.empresaService.getDetallesEmpresa(codigoEmpresa);
  }

  @Post('')
  async agregarEmpresas(
    @Body() nuevaEmpresa: Empresa,
  ): Promise<Empresa> {
    return await this.empresaService.agregarEmpresa(nuevaEmpresa);
  }

  @Put('/:codigoEmpresa/acciones')
  async actualizarAcciones(
    @Param('codigoEmpresa') codigoEmpresa: string,
  ): Promise<Empresa> {
    return await this.empresaService.actualizarAcciones(codigoEmpresa);
  }

  @Delete('/:codigoEmpresa')
  async borrarEmpresa(
    @Param('codigoEmpresa') codigoEmpresa: string,
  ): Promise<any> {
    return await this.empresaService.borrarEmpresa(codigoEmpresa);
  }
}
