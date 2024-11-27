import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bolsa } from './entities/bolsa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class BolsaService { 
  private readonly backendUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000';

  constructor(
    @InjectRepository(Bolsa)
    private readonly bolsaRepository: Repository<Bolsa>,
  ) {}

    async getBolsas(): Promise<Bolsa[]> {
      return await this.bolsaRepository.find();
    }

    async getIndicesBolsa(codigoBolsa: string, fechaDesde: string, fechaHasta: string): Promise<any> {
      try {
        const url = `${this.backendUrl}/indices/${codigoBolsa}/cotizaciones`;
        const response = await axios.get(url, {
          params: {
            fechaDesde,
            fechaHasta
          },
        });

        return response.data;
      } catch(error) {
        throw new HttpException(
          `Error al obtener cotizaciones de empresa ${codigoBolsa}`,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    async actualizarBolsas(): Promise<any> {
      try {
        const url = `${this.backendUrl}/indices`;
        const response = await axios.get(url)

        const bolsas = response.data
          .map((bolsa: any) => ({
            codigoBolsa: bolsa.code
          }))

        for(const bolsa of bolsas) {
          const existeBolsa = await this.bolsaRepository.findOne({
            where: {
              codigoBolsa: bolsa.codigoBolsa
            },
          });

          if(!existeBolsa) {
            await this.bolsaRepository.save(bolsa);
          }
        }
      } catch(error) {
        console.log(`Error al actualizar las bolsas: ${error.message}`);
      }
    }
}
