import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Empresa } from './entities/empresa.entity';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import axios from 'axios';
import { Cotizacion } from './entities/cotizacion.entity';

@Injectable()
export class EmpresaService {
  private readonly backendUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000';

  constructor(private readonly httpService: HttpService,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>
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

  async getCotizacionesByFechas(codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<any> {
    try {
      const empresa = await this.empresaRepository.findOne({
        where: { codigoEmpresa },
      });
  
      if (!empresa) {
        throw new HttpException(
          `Empresa con código ${codigoEmpresa} no encontrada`,
          HttpStatus.NOT_FOUND
        );
      }
  
      const fechaInicio = fechaDesde.split('T')[0]; // Obtener solo la fecha (YYYY-MM-DD)
      const horaInicio = fechaDesde.split('T')[1]; // Obtener solo la hora (HH:mm)
      const fechaFin = fechaHasta.split('T')[0]; // Igual para fecha final
      const horaFin = fechaHasta.split('T')[1];
  
      let cotizaciones;
  
      if (fechaInicio === fechaFin) {
        cotizaciones = await this.cotizacionRepository.find({
          where: [
            {
              empresa: empresa,
              fecha: fechaInicio,
              hora: Between(horaInicio, horaFin),
            },
          ],
          order: {
            fecha: 'ASC',
            hora: 'ASC',
          },
        });
      } else {
        cotizaciones = await this.cotizacionRepository.find({
          where: [
            {
              empresa: empresa,
              fecha: fechaInicio,
              hora: MoreThanOrEqual(horaInicio),
            },
            {
              empresa: empresa,
              fecha: fechaFin,
              hora: LessThanOrEqual(horaFin),
            },
            {
              empresa: empresa,
              fecha: Between(fechaInicio, fechaFin),
            },
          ],
          order: {
            fecha: 'ASC',
            hora: 'ASC',
          },
        });
      }
  
      return cotizaciones;
    } catch (error) {
      throw new HttpException(
        `Error al obtener cotizaciones de empresa ${codigoEmpresa}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async actualizarCotizaciones(): Promise<any> {
    const empresas = await this.empresaRepository.find();

    if (!empresas.length) {
      throw new HttpException(
        'No se encontraron empresas en la base de datos.',
        HttpStatus.NOT_FOUND,
      );
    }

    const fechaActual = new Date();
    const fechaHasta = fechaActual.toISOString().slice(0, 16); // Formato AAAA-MM-DDTHH:mm
    let fechaDesde: string = '';

    for (const empresa of empresas) {
      const ultimaCotizacion = await this.cotizacionRepository.findOne({
        where: { empresa: { id: empresa.id } },
        order: { fecha: 'DESC', hora: 'DESC' },
      });

      if (!ultimaCotizacion) {
        fechaDesde = '2024-01-01T00:00';
      } else {
        fechaDesde = `${ultimaCotizacion.fecha}T${ultimaCotizacion.hora}`;
      }

      try {
        const url = `${this.backendUrl}/empresas/${empresa.codigoEmpresa}/cotizaciones`;
        const response = await axios.get(url, {
          params: { fechaDesde, fechaHasta },
        });

        const cotizaciones = response.data
        .map((cotizacion: any) => ({
          fecha: cotizacion.fecha,
          hora: cotizacion.hora,
          cotizacion: parseFloat(cotizacion.cotization),
          empresa,
        }))
        .filter((cotizacion: any) => {
          const fecha = new Date(`${cotizacion.fecha}T${cotizacion.hora}`);
          const diaSemana = fecha.getDay(); // 0 a 6 => domingo a sabado.
          const hora = fecha.getHours();

          return diaSemana >= 1 && diaSemana <= 5 && hora >= 9 && hora <= 15;
        });

        for (const cotizacion of cotizaciones) {
          const existeCotizacion = await this.cotizacionRepository.findOne({
            where: {
              fecha: cotizacion.fecha,
              hora: cotizacion.hora,
              empresa: { id: empresa.id },
            },
          });

          if (!existeCotizacion) {
            await this.cotizacionRepository.save(cotizacion);
          }
        }
      } catch (error) {
        console.error(
          `Error al actualizar cotizaciones para la empresa ${empresa.codigoEmpresa}: ${error.message}`,
        );
      }
    }
  }
}