import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rutas } from './entities/ruta.entity';
import { RutasController } from './rutas.controller';
import { RutasService } from './rutas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rutas])],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
