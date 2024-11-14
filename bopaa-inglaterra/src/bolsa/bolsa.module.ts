import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bolsa } from './entities/bolsa.entity';
import { BolsaController } from './bolsa.controller';
import { BolsaService } from './bolsa.service';


@Module({
  imports: [TypeOrmModule.forFeature([Bolsa])],
  controllers: [BolsaController],
  providers: [BolsaService],
  exports: [BolsaService]
})
export class BolsaModule { }
