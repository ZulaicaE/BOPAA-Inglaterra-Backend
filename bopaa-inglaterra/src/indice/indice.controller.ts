import { Controller, Put } from '@nestjs/common';
import { IndiceService } from './indice.service';

@Controller('indices')
export class IndiceController { 
  constructor(private readonly indiceService: IndiceService) {}

  //@Get('')

  @Put('/actualizar')
  async actualizarIndicesBursatiles() {
    return this.indiceService.actualizarIndicesBursatiles();
  }
}
