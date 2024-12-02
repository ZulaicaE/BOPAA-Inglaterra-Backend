import { Module } from "@nestjs/common";
import { BolsaModule } from "src/bolsa/bolsa.module";
import { EmpresaModule } from "src/empresas/empresa.module";
import { IndiceModule } from "src/indice/indice.module";
import { UpdateService } from "./update.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({

    imports: [BolsaModule, EmpresaModule, IndiceModule, ScheduleModule.forRoot(), ],
    providers: [UpdateService],
  })
  export class UpdateModule { }
  