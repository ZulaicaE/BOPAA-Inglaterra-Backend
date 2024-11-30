import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Indice } from './entities/indice.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from 'src/empresas/entities/empresa.entity';
import { Cotizacion } from 'src/empresas/entities/cotizacion.entity';
import axios from 'axios';

@Injectable()

export class IndiceService {
  private readonly backendUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000';

  constructor(
    @InjectRepository(Indice)
    private readonly indiceRepository: Repository<Indice>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
  ) { }

  async postearBolsar(body: { code: string, name: string }): Promise<any> {
    try {
      const url = `${this.backendUrl}/indices`;
      const response = await axios.post(url, body);

      return response
    } catch (error) {
      throw new HttpException(
        'Error al postear el codigo de la bolsa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getIndicesBolsa(codigoBolsa: string, fechaDesde: string, fechaHasta: string): Promise<any> {
    try {
      const url = `${this.backendUrl}/indices/${codigoBolsa}/cotizaciones`;
      const response = await axios.get(url, {
        params: {
          fechaDesde,
          fechaHasta,
        },
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error al obtener las cotizaciones de la bola ${codigoBolsa}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async actualizarIndicesBursatiles(): Promise<void> {
    // Obtener empresas relacionadas con la bolsa LSE
    const empresas = await this.empresaRepository.find({
      where: { bolsa: { id: 1 } }, // bolsa con id 1 LSE
    });

    if (!empresas.length) {
      throw new HttpException(
        'No se encontraron empresas asociadas a la bolsa LSE.',
        HttpStatus.NOT_FOUND,
      );
    }

    const ultimoIndice = await this.indiceRepository
      .createQueryBuilder('indice')
      .select(['indice.fecha AS fecha', 'indice.hora AS hora'])
      .where('indice.idBolsa = :bolsa', { bolsa: 1 })
      .orderBy('indice.fecha', 'DESC')
      .addOrderBy('indice.hora', 'DESC')
      .getRawOne();

    // Obtener fechas únicas de las cotizaciones
    const fechasUnicas = await this.cotizacionRepository
      .createQueryBuilder('cotizacion')
      .select(['cotizacion.fecha AS fecha', 'cotizacion.hora AS hora'])
      .where('cotizacion.empresa IN (:...empresas)', {
        empresas: empresas.map((empresa) => empresa.id),
      })
      .andWhere(
        '(cotizacion.fecha > :ultimaFecha OR (cotizacion.fecha = :ultimaFecha AND cotizacion.hora > :ultimaHora))',
        {
          ultimaFecha: ultimoIndice?.fecha || '0000-00-00',
          ultimaHora: ultimoIndice?.hora || '00:00',
        },
      )
      .groupBy('cotizacion.fecha, cotizacion.hora')
      .orderBy('cotizacion.fecha', 'ASC')
      .addOrderBy('cotizacion.hora', 'ASC')
      .getRawMany();

    console.log('Fechas únicas posteriores a la última registrada:', fechasUnicas);

    // Procesar cada fecha única
    for (const { fecha, hora } of fechasUnicas) {
      console.log(`Procesando fecha: ${fecha}, hora: ${hora}`);

      // Obtener todas las cotizaciones para la fecha y hora específicas
      const cotizaciones = await this.cotizacionRepository.find({
        where: {
          fecha,
          hora,
          empresa: { id: In(empresas.map((empresa) => empresa.id)) },
        },
      });

      if (!cotizaciones.length) {
        console.log(`No se encontraron cotizaciones para ${fecha} ${hora}.`);
        continue;
      }

      // Calcular el promedio de las cotizaciones
      const sumaCotizaciones = cotizaciones.reduce(
        (suma, cotizacion) => suma + Number(cotizacion.cotizacion),
        0,
      );
      console.log('SUMA TOTAL:', sumaCotizaciones);
      console.log('cantidad empresas:', empresas.length)
      const promedioCotizacion = sumaCotizaciones / empresas.length;

      console.log(
        `Promedio calculado para ${fecha} ${hora}: ${promedioCotizacion.toFixed(
          2,
        )}`,
      );

      // Crear o actualizar el índice
      const indice = this.indiceRepository.create({
        fecha,
        hora,
        indiceBursatil: promedioCotizacion,
        bolsa: { id: 1 }, // Bolsa LSE
      });
      await this.indiceRepository.save(indice);
    }

    console.log('Actualización de índices bursatiles completada.');
  }

  async postearCotizaciones(codigoBolsa: string): Promise<any> {

    const url = `${this.backendUrl}/indices/cotizaciones`;

    const fechaDesde: string = '2024-01-01T00:00';
    const fechaActual = new Date();
    const fechaHasta: string = fechaActual.toISOString().slice(0, 16); // Formato AAAA-MM-DDTHH:mm
    
    try {
      const indices = await this.getIndicesBolsa(codigoBolsa, fechaDesde, fechaHasta);
  
      let ultimaFecha = '0000-00-00';
      let ultimaHora = '00:00';
  
      if (indices.length > 0) {
        const ultimoIndice = indices[indices.length - 1];
        ultimaFecha = ultimoIndice.fecha;
        ultimaHora = ultimoIndice.hora;
      }
  
      console.log(
        `Ultima fecha: ${ultimaFecha} ${ultimaHora}`
      );
  
      const indicesLocales = await this.indiceRepository
        .createQueryBuilder('indice')
        .where('indice.idbolsa = :bolsa', { bolsa: 1 }) // Bolsa LSE
        .andWhere(
          '(indice.fecha > :fecha OR (indice.fecha = :fecha AND indice.hora > :hora))',
          { fecha: ultimaFecha, hora: ultimaHora },
        )
        .orderBy('indice.fecha', 'ASC')
        .addOrderBy('indice.hora', 'ASC')
        .getMany();
  
      if (!indicesLocales.length) {
        console.log('No hay índices locales nuevos para subir.');
        return;
      }
  
      console.log(`Se encontraron ${indicesLocales.length} índices locales para subir.`);
  
      for (const indice of indicesLocales) {
        const body = {
          codigoIndice: codigoBolsa,
          fecha: indice.fecha,
          hora: indice.hora,
          valorIndice: indice.indiceBursatil,
        };
  
        try {
          await axios.post(url, body);
          console.log(`Índice ${indice.fecha} ${indice.hora} subido con éxito.`);
        } catch (error) {
          console.log(`Error al subir el índice ${indice.fecha} ${indice.hora}`, error);
        }
      }
      return ('Indices actualizados con exito.')
    } catch (error) {
      throw new HttpException(
        'Error al procesar la subida de cotizaciones.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
