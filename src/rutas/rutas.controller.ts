import { Controller, Post, Body, NotFoundException, BadRequestException, HttpException, HttpStatus, Get } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  async getRutas() {
    return this.rutasService.getRutas();
  }

  @Post('comprar-asientos')
  async comprarAsientos(@Body() comprarAsientosDto: CreateRutaDto): Promise<string> {
    const { origen, destino, fechaViaje, asientosComprar } = comprarAsientosDto;

    const ruta = await this.rutasService.findByOrigenDestinoYFecha(origen, destino, fechaViaje);
    if (!ruta) {
      throw new NotFoundException('No se encontró una ruta disponible para la fecha y destino especificados.');
    }

    if (ruta.asientos_disponibles < asientosComprar) {
      throw new BadRequestException('No hay suficientes asientos disponibles para la cantidad solicitada.');
    }

    await this.rutasService.updateAsientosDisponibles(ruta.origen,ruta.destino,ruta.fechaViaje, ruta.asientos_disponibles - asientosComprar);
    const monto = ruta.precio * asientosComprar;

    const resultadoPago = await this.rutasService.realizarPago(comprarAsientosDto.numeroCuenta, monto);
    if (resultadoPago.error) {
      console.log("hola")
      await this.rutasService.rollbackUpdateAsientos(origen, destino, fechaViaje, asientosComprar);
      throw new HttpException(resultadoPago.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return `Asientos comprados exitosamente para la ruta ${ruta.origen} - ${ruta.destino} el ${ruta.fechaViaje}.`;
  }
}
