import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ruta {
  @Prop({ required: true })
  _id: string;
  @Prop({ required: true })
  origen: string;

  @Prop({ required: true })
  destino: string;

  @Prop({ required: true })
  fechaViaje: string;

  @Prop({ type: Number })
  precio: number;

  @Prop({ default: 0 })
  asientos_totales: number;

  @Prop({ default: 0 })
  asientos_disponibles: number;
}

export type RutaDocument = Ruta & Document;

export const RutaSchema = SchemaFactory.createForClass(Ruta);
