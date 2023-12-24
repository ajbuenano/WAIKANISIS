import { Bodega } from "./bodega.interface";
import { Producto } from "./producto.interface";
import { Restaurante } from "./restaurante.interface";

export interface Inventario {
    id: number,
    producto: Producto,
    restaurante: Restaurante,
    bodega: Bodega,
    total?: number
}