import { Motivo } from "./motivo.interface";
import { Producto } from "./producto.interface";
import { Restaurante } from "./restaurante.interface";

export interface Bodega {
    uid: string,
    id: number,
    producto: Producto,
    cantidad: number,
    stockmin: number,
    restaurante: Restaurante
}

export interface BodegaMovimiento {
    uid: string,
    id: number,
    fecha: Date,
    producto: Producto,
    motivo: Motivo,
    cantidad: number,
    operacion:string
}