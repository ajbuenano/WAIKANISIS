import { Categoria } from "./categoria.interface";

export interface Producto {
    nombre: string,
    uid: string,
    id: number,
    categoria: Categoria,
    verEnRestaurante: boolean,
    stockMinBodega: number,
    stockMinRestaurante: number
}

export interface ProductoDTO {
    nombre: string,
    uid: string,
    id: number,
    categoria: any,
    verEnRestaurante: boolean,
    stockMinBodega: number,
    stockMinRestaurante: number
}