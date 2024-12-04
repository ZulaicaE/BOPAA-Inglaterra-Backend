import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';
import { HttpModule } from '@nestjs/axios';
import { Bolsa } from 'src/bolsa/entities/bolsa.entity';
import { BolsaService } from 'src/bolsa/bolsa.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa, Cotizacion, Bolsa]),
    HttpModule
  ],
  controllers: [EmpresaController],
  providers: [EmpresaService, BolsaService],
  exports: [EmpresaService]
})
export class EmpresaModule { }
