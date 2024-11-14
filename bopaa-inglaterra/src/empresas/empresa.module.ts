import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Cotizacion])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [EmpresaService]
})
export class EmpresaModule { }
