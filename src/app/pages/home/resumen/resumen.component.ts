import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Restaurante, RestauranteMovimiento } from 'src/app/shared/models/restaurante.interface';
import { environment } from 'src/environments/environment';
import { Bodega, BodegaMovimiento } from 'src/app/shared/models/bodega.interface';
import { Inventario } from 'src/app/shared/models/inventario.interface';
import { Producto } from 'src/app/shared/models/producto.interface';
import { forkJoin, map } from 'rxjs';

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

    const productos$ = this.FirestoreService.getCollection<Producto>(environment.pathProducto);
    const restaurantes$ = this.FirestoreService.getCollection<Restaurante>(environment.pathInventarioRestaurante);
    const bodegas$ = this.FirestoreService.getCollection<Bodega>(environment.pathInventarioBodega);

    forkJoin([productos$, restaurantes$, bodegas$]).pipe(
      map(([productos, restaurantes, bodegas]) => {
        let i = 1;
        this.loadingInventario = true;
        productos.forEach((producto) => {
          restaurantes.forEach((restaurante) => {
            bodegas.forEach((bodega) => {

              const item: Inventario = {
                id: i++, // Asigna un valor apropiado
                producto,
                restaurante,
                bodega,
                total: bodega.cantidad - restaurante.cantidad, // Asigna un valor apropiado
              };

              this.itemsInventario.push(item);
            });
          });
        });
        console.log(this.itemsRestaurante)
        this.loadingInventario = false;
      })
    );

  }
  

  // Función para convertir Timestamp a Date
  convertTimestampToDate(timestamp: any): Date {
    const seconds = timestamp.seconds || 0;
    const nanoseconds = timestamp.nanoseconds || 0;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }
}
