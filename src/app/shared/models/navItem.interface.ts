export interface INavbarData {
    routeLink?:string,
    icon?:string,
    label:string,
    expanded?:boolean,
    permisos?: string[],
    items?: INavbarData[]
}