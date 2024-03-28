import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { Ruta,RutaSchema } from './entities/ruta.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ruta.name, schema: RutaSchema }])
  ],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
