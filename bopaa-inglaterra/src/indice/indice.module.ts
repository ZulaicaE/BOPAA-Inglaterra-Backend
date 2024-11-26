import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indice } from './entities/indice.entity';
import { IndiceController } from './indice.controller';
import { IndiceService } from './indice.service';
import { Empresa } from 'src/empresas/entities/empresa.entity';
import { Cotizacion } from 'src/empresas/entities/cotizacion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Indice, Empresa, Cotizacion])],
  controllers: [IndiceController],
  providers: [IndiceService],
  exports: [IndiceService]
})
export class IndiceModule { }
