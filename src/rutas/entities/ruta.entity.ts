import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Rutas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  origen: string;

  @Column({ length: 100 })
  destino: string;

  @Column({ length: 100 })
  fechaViaje: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ default: 0 })
  asientos_totales: number;
  
  @Column({ default: 0 })
  asientos_disponibles: number;
  
}
