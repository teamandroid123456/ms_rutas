import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rutas } from './rutas/entities/ruta.entity';
import { RutasModule } from './rutas/rutas.module';

@Module({
  imports: [RutasModule,
    TypeOrmModule.forRoot({
      type: 'mysql', 
      host: 'localhost', 
      port: 3306, 
      username: 'root',
      password: '12345678', 
      database: 'bd_atotal',
      entities: [Rutas],
      synchronize: true, 
    }),
  ],
})
export class AppModule {}
