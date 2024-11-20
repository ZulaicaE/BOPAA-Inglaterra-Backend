import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Empresa } from './entities/empresa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpresaService {
  private readonly backendUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000';

  constructor(private readonly httpService: HttpService,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>
  ) { }

  async getEmpresas(): Promise<Empresa[]> {
    return await this.empresaRepository.find();
  }

  async getDetallesEmpresa(codigoEmpresa: string): Promise<any> {
    try {
      const url = `${this.backendUrl}/empresas/${codigoEmpresa}/details`;

      const response = await firstValueFrom(this.httpService.get(url));

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error al obtener la empresa con código ${codigoEmpresa}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async agregarEmpresa(nuevaEmpresa: Empresa): Promise<Empresa> {
    try {
      const empresa = this.empresaRepository.create(nuevaEmpresa);
      return await this.empresaRepository.save(empresa);
    } catch (error) {
      throw new HttpException(
        `Error al agregar la empresa: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async actualizarAcciones(codigoEmpresa: string): Promise<Empresa> {

    const detallesEmpresa = await this.getDetallesEmpresa(codigoEmpresa);

    if (!detallesEmpresa) {
      throw new HttpException(
        `No se encontraron detalles para la empresa ${codigoEmpresa}.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const empresa = await this.empresaRepository.findOne({
      where: { codigoEmpresa },
    });

    if (!empresa) {
      throw new HttpException(
        `Empresa ${codigoEmpresa} no encontrada.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const cantidadAcciones = Number(detallesEmpresa.cantidadAcciones);

    if (isNaN(cantidadAcciones)) {
      throw new HttpException(
        `La cantidad de acciones no es válida para la empresa ${codigoEmpresa}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    empresa.acciones = cantidadAcciones;

    return await this.empresaRepository.save(empresa);
  }

  async borrarEmpresa(codigoEmpresa: string): Promise<any> {

    const empresa = await this.empresaRepository.findOne({
      where: { codigoEmpresa },
    });

    if (!empresa) {
      throw new HttpException(
        `Empresa ${codigoEmpresa} no encontrada.`,
        HttpStatus.NOT_FOUND
      );
    } else {
      return await this.empresaRepository.delete(empresa);
    }
  }

}