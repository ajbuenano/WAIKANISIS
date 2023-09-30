import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { RestauranteMovimiento } from 'src/app/shared/models/restaurante.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit{
  date!: Date[];
  maxDate = new Date();
  items: RestauranteMovimiento[] = [];
  public FirestoreService = inject(FirestoreService);
  loading: boolean = true;

  async ngOnInit(): Promise<void> {
    const fechaActual = new Date();
    const startDate = new Date(fechaActual);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(fechaActual);
    endDate.setHours(23, 59, 59, 999);

    this.date = [startDate, endDate];
    await this.getResumenRestaurante();

    this.loading = false;
  }

  getValueEvent(event: Event){
    return (event.target as HTMLInputElement).value;
  }

  async getResumenRestaurante(){
    const startDate = this.date[0];
    const endDate = this.date[1];

    if(startDate && endDate){
      this.loading = true;
      endDate.setHours(23, 59, 59, 999);
      await this.FirestoreService.getCollectionByDate<RestauranteMovimiento>(environment.pathMovimientoRestaurante, startDate, endDate).subscribe( res => {
        let i=1;
        res.map(async item => { 
          item.id = i++;
          item.fecha = this.convertTimestampToDate(item.fecha);
          item.producto = (await (item.producto as any).get()).data();
          item.producto.categoria = (await (item.producto.categoria as any).get()).data();
        });
        this.items = res;
      }); 
    }

    this.loading = false;
  }

  // Función para convertir Timestamp a Date
  convertTimestampToDate(timestamp: any): Date {
    const seconds = timestamp.seconds || 0;
    const nanoseconds = timestamp.nanoseconds || 0;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }
}
