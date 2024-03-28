import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ruta, RutaDocument } from './entities/ruta.entity';
import axios from 'axios';
@Injectable()
export class RutasService {
  constructor(
    @InjectModel(Ruta.name) private readonly rutaModel: Model<RutaDocument>
  ) {}

  async getRutas(): Promise<{ origen: string, destino: string, fechaViaje: string, precio: number, asientos_disponibles: number }[]> {
    const rutas = await this.rutaModel.find().exec();
    return rutas.map(ruta => ({
      origen: ruta.origen,
      destino: ruta.destino,
      fechaViaje: ruta.fechaViaje,
      precio: ruta.precio,
      asientos_disponibles: ruta.asientos_disponibles
    }));
  }

  async findByOrigenDestinoYFecha(origen: string, destino: string, fechaViaje: string): Promise<Ruta> {
    return this.rutaModel.findOne({ origen, destino, fechaViaje }).exec();
  }

  async updateAsientosDisponibles(origen: string, destino: string, fechaViaje: string, newAvailableSeats: number): Promise<void> {
    await this.rutaModel.updateOne({ origen, destino, fechaViaje }, { asientos_disponibles: newAvailableSeats }).exec();
  }

  async realizarPago(numeroCuenta: string, monto: number): Promise<{ error: string | null }> {
    try {
      const respuesta = await axios.post('http://localhost:3050/pago', {
        numeroCuenta,
        monto,
      });
      return { error: null };
    } catch (error) {
      if (error.response) {
        return { error: 'No se pudo procesar el pago. Detalles: ' + error.response.data.message };
      } else if (error.request) {
        return { error: 'No se pudo conectar con el servicio de pago.' };
      } else {
        return { error: 'Ocurrió un error al procesar el pago.' };
      }
    }
  }

  async rollbackUpdateAsientos(origen: string, destino: string, fechaViaje: string, asientosComprar: number): Promise<void> {
    const ruta = await this.rutaModel.findOne({ origen, destino, fechaViaje }).exec();
    if (!ruta) {
      throw new NotFoundException('La ruta especificada no existe.');
    }
    await this.rutaModel.updateOne({ origen, destino, fechaViaje }, { asientos_disponibles: ruta.asientos_disponibles+ asientosComprar }).exec();
  }
}
