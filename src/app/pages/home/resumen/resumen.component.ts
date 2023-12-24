import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Restaurante, RestauranteMovimiento } from 'src/app/shared/models/restaurante.interface';
import { environment } from 'src/environments/environment';
import { Bodega, BodegaMovimiento } from 'src/app/shared/models/bodega.interface';
import { Inventario } from 'src/app/shared/models/inventario.interface';
import { Producto } from 'src/app/shared/models/producto.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit{
  dateRestaurante!: Date[];
  dateBodega!: Date[];
  maxDate = new Date();
  itemsRestaurante: RestauranteMovimiento[] = [];
  itemsBodega: BodegaMovimiento[] = [];
  itemsProductos: Producto[] = [];
  itemsInventario: Inventario[] = [];
  public FirestoreService = inject(FirestoreService);
  loadingRestaurante: boolean = true;
  loadingBodega: boolean = true;
  loadingInventario: boolean = true;

  async ngOnInit(): Promise<void> {
    const fechaActual = new Date();
    const startDate = new Date(fechaActual);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(fechaActual);
    endDate.setHours(23, 59, 59, 999);

    this.dateRestaurante = [startDate, endDate];
    this.dateBodega = [startDate, endDate];

    this.getResumenBodega();
    await this.getResumenRestaurante();
    console.log("entra a producto");
    await this.getProductos();
    console.log("pasa de producto");
    console.log(this.itemsProductos)
    this.getResumenInventario();
    

    this.loadingRestaurante = false;
    this.loadingBodega = false;
    this.loadingInventario = false;
  }

  getValueEvent(event: Event){
    return (event.target as HTMLInputElement).value;
  }

  async getResumenRestaurante(){
    const startDate = this.dateRestaurante[0];
    const endDate = this.dateRestaurante[1];

    if(startDate && endDate){
      this.loadingRestaurante = true;
      endDate.setHours(23, 59, 59, 999);

      await this.FirestoreService.getCollectionByDate<RestauranteMovimiento>(environment.pathMovimientoRestaurante, startDate, endDate).subscribe( res => {
        let i=1;
        res.map(async item => { 
          item.id = i++;
          item.fecha = this.convertTimestampToDate(item.fecha);
          item.producto = (await (item.producto as any).get()).data();
          item.producto.categoria = (await (item.producto.categoria as any).get()).data();
        });
        this.itemsRestaurante = res;
      }); 
    }
    this.loadingRestaurante = false;
  }

  getResumenBodega(){
    const startDate = this.dateBodega[0];
    const endDate = this.dateBodega[1];
  
    if(startDate && endDate){
      this.loadingBodega = true;
      endDate.setHours(23, 59, 59, 999);

      this.FirestoreService.getCollectionByDate<BodegaMovimiento>(
      environment.pathMovimientoBodega, startDate, endDate
    ).subscribe(async (res) => {
      let i = 1;
      this.itemsBodega = await Promise.all(res.map(async (item) => {
        item.id = i++;
        item.fecha = this.convertTimestampToDate(item.fecha);
        item.producto = (await (item.producto as any).get()).data();
        item.producto.categoria = (await (item.producto.categoria as any).get()).data();
        item.motivo = (await (item.motivo as any).get()).data();
        return item;
      }));
    });
    }
    this.loadingBodega = false;
  }

  async getResumenInventario(){
    this.loadingInventario = true;
    let i = 1;

    for (const producto of this.itemsProductos) {
      console.log(producto);
      let restaurante: Restaurante|null = null; 
      let bodega: Bodega|null = null;
      let refProducto = await this.FirestoreService.getRef(environment.pathProducto, producto.uid);
      await this.getInventarioRestauranteByProducto(refProducto).then((res: any) => {
        if (res.length != 0){
          restaurante = (res as Restaurante[])[0]
        } else {
          restaurante = {} as Restaurante;
          restaurante.cantidad = 0;
        }
        console.log("rest",res);
      });
      await this.getInventarioBodegaByProducto(refProducto).then((res: any) => {
        if (res.length != 0){
          bodega = (res as Bodega[])[0]
        } else {
          bodega = {} as Bodega;
          bodega.cantidad = 0;
        }
        console.log("bod",res);
      });

      if (restaurante!=null && bodega!=null) {
  
        const item: Inventario = {
          id: i++, // Otra propiedad para identificar el producto
          producto,
          restaurante: restaurante as Restaurante,
          bodega: bodega as Bodega,
          total: (bodega as Bodega).cantidad + (restaurante as Restaurante).cantidad
        };
        console.log("item",item);
        this.itemsInventario.push(item);
      }
    }
    this.loadingBodega = false;
  }

  async getInventarioRestauranteByProducto(refProducto:any){
    return new Promise((resolve) => {
      this.FirestoreService.getCollectionQuery(environment.pathInventarioRestaurante,'producto','==', refProducto).subscribe( res => {
        resolve(res);
      });
    })
  }
  
  async getInventarioBodegaByProducto(refProducto:any){
    return new Promise((resolve) => {
      this.FirestoreService.getCollectionQuery(environment.pathInventarioBodega,'producto','==', refProducto).subscribe( res => {
        resolve(res);
      });
    })
  }

  async getProductos(){
    return new Promise((resolve) => {
      this.FirestoreService.getCollection<Producto>(environment.pathProducto).subscribe( async res => {
        let i=1;
        await res.map(async item => { 
          item.id = i++;
          item.categoria = (await (item.categoria as any).get()).data();
        });
        console.log("productos",res);
        this.itemsProductos = res;
        resolve('');
      });
      console.log("pasa a funcion");
    })
  }
  

  // Función para convertir Timestamp a Date
  convertTimestampToDate(timestamp: any): Date {
    const seconds = timestamp.seconds || 0;
    const nanoseconds = timestamp.nanoseconds || 0;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }
}
