import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaModule } from './empresas/empresa.module';
import { ConfigModule } from '@nestjs/config';
import { IndiceModule } from './indice/indice.module';
import { BolsaModule } from './bolsa/bolsa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
      logging: 'all',
    }),
    BolsaModule,
    EmpresaModule,
    IndiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
