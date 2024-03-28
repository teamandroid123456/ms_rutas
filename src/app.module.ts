
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RutasModule } from './rutas/rutas.module';
import { Ruta,RutaSchema } from './rutas/entities/ruta.entity';

@Module({
  imports: [
    RutasModule,
    MongooseModule.forRoot('mongodb+srv://jojhan24:21DEjunio@cluster0.a4ikckw.mongodb.net/bd_atotal'),
    MongooseModule.forFeature([{ name: Ruta.name, schema: RutaSchema }]),
  ],
})
export class AppModule {}
