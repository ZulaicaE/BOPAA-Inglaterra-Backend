import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indice } from './entities/indice.entity';
import { IndiceController } from './indice.controller';
import { IndiceService } from './indice.service';


@Module({
  imports: [TypeOrmModule.forFeature([Indice])],
  controllers: [IndiceController],
  providers: [IndiceService],
  exports: [IndiceService]
})
export class IndiceModule { }
