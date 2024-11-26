import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Indice } from './entities/indice.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from 'src/empresas/entities/empresa.entity';
import { Cotizacion } from 'src/empresas/entities/cotizacion.entity';

@Injectable()
export class IndiceService {
  constructor(
    @InjectRepository(Indice)
    private readonly indiceRepository: Repository<Indice>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
  ) {}

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
}
