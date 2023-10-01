import { Producto } from "./producto.interface";

export interface Restaurante {
    uid: string,
    id: number,
    producto: Producto,
    cantidad: number,
    stockmin: number,
    cantidadActual: number
}

export interface RestauranteMovimiento {
    uid: string,
    id: number,
    fecha: Date,
    producto: Producto,
    cantidad: number,
}