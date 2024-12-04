import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indice } from './entities/indice.entity';
import { IndiceController } from './indice.controller';
import { IndiceService } from './indice.service';
import { Empresa } from 'src/empresas/entities/empresa.entity';
import { Cotizacion } from 'src/empresas/entities/cotizacion.entity';
import { BolsaService } from 'src/bolsa/bolsa.service';
import { Bolsa } from 'src/bolsa/entities/bolsa.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Indice, Empresa, Cotizacion, Bolsa])],
  controllers: [IndiceController],
  providers: [IndiceService, BolsaService],
  exports: [IndiceService]
})
export class IndiceModule { }
