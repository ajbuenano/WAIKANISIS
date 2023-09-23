import { Categoria } from "./categoria.interface";

export interface Producto {
    nombre: string,
    uid: string,
    id: number,
    categoria: Categoria
}

export interface ProductoDTO {
    nombre: string,
    uid: string,
    id: number,
    categoria: any
}