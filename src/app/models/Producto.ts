export interface Producto {
    id?: string,
    nombre?: string,
    categoria?: Categoria
} 

export interface Categoria {
    id?: string,
    nombre?: string
}