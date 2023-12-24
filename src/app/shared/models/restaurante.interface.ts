import { Producto } from "./producto.interface";

export interface Restaurante {
    uid: string,
    id: number,
    producto: Producto,
    cantidad: number,
    cantidadActual: number
}

export interface RestauranteDTO {
    uid: string,
    id: number,
    producto: any,
    cantidad: number,
    cantidadActual: number
}

export interface RestauranteMovimiento {
    uid: string,
    id: number,
    fecha: Date,
    producto: Producto,
    cantidad: number,
}