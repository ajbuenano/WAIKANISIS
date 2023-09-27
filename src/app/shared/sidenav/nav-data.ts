import { INavbarData } from "../models/navItem.interface";

export const navbarData:INavbarData[] = [
    {
        routeLink: 'historial',
        icon: 'library_books',
        label: 'Historial de Movimientos',
        permisos: ['admin']
    },
    {
        routeLink: 'restaurante',
        icon: 'restaurant_menu',
        label: 'Restaurante',
        permisos: ['admin', 'restaurante']
    },
    {
        routeLink: 'bodega',
        icon: 'warehouse',
        label: 'Bodega',
        permisos: ['admin', 'bodega']
    },
    {
        routeLink: '/home/producto',
        icon: 'package_2',
        label: 'Productos',
        permisos: ['admin']
    },
    {
        icon: 'settings',
        label: 'Configuración',
        permisos: ['admin'],
        items:[
            {
                routeLink: '/home/categoria',
                label: 'Categorías'
            },
            {
                routeLink: '/home/motivo',
                label: 'Motivos'
            },
            {
                routeLink: '/home/usuario',
                label: 'Usuarios'
            }
        ]
    }

];