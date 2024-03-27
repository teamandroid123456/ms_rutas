import { Injectable,BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rutas } from './entities/ruta.entity';
import axios from 'axios';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Rutas)
    private readonly rutaRepository: Repository<Rutas>
  ) {}
  async getRutas(): Promise<{ origen: string, destino: string, fechaViaje: string, precio: number, asientos_disponibles: number }[]> {
    const rutas = await this.rutaRepository.find();
    return rutas.map(ruta => ({
      origen: ruta.origen,
      destino: ruta.destino,
      fechaViaje: ruta.fechaViaje,
      precio: ruta.precio,
      asientos_disponibles: ruta.asientos_disponibles
    }));
  }
  async findRuta(origen: string, destino: string, fechaViaje: string): Promise<Rutas> {
    const ruta =await this.rutaRepository.findOne({ where: { origen, destino, fechaViaje } });
    return await this.rutaRepository.findOne({ where: { origen, destino, fechaViaje } });
  }
  
  async findByOrigenDestinoYFecha(origen: string, destino: string, fechaViaje: string): Promise<Rutas> {
    return this.rutaRepository.findOne({ where: { origen, destino, fechaViaje } });
  }
  async updateAsientosDisponibles(rutaId: number, newAvailableSeats: number): Promise<void> {
    await this.rutaRepository.update(rutaId, { asientos_disponibles: newAvailableSeats });
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

  async rollbackUpdateAsientos(origen: string, destino: string, fechaViaje: string, asientosComprar:number): Promise<void> {
    const ruta =await this.rutaRepository.findOne({ where: { origen, destino, fechaViaje } });
    if (!ruta) {
      throw new NotFoundException('La ruta especificada no existe.');
    }
    ruta.asientos_disponibles += asientosComprar;
    await this.rutaRepository.save(ruta);
  }
  
}
