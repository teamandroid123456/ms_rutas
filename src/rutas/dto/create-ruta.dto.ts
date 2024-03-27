// create-ruta.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRutaDto {
  @IsNotEmpty()
  @IsString()
  origen: string;

  @IsNotEmpty()
  @IsString()
  destino: string;

  @IsNotEmpty()
  @IsString()
  fechaViaje: string;

  @IsNotEmpty()
  @IsNumber()
  asientosComprar: number;

  @IsNotEmpty()
  @IsString()
  numeroCuenta: string;

}
