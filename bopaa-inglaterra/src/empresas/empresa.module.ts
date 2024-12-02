import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa, Cotizacion]),
    HttpModule
  ],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [EmpresaService]
})
export class EmpresaModule { }
