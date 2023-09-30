import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { FirestoreService } from '../../services/firestore.service';
import { Restaurante, RestauranteDTO } from 'src/app/shared/models/restaurante.interface';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.component.html',
  styleUrls: ['./restaurante.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class RestauranteComponent {

  items!: Restaurante[];
  public FirestoreService = inject(FirestoreService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  loading: boolean = true;

  async ngOnInit(): Promise<void> {
    await this.get();
    this.loading = false;
  }

  getValueEvent(event: Event){
    return (event.target as HTMLInputElement).value;
  }

  async get(){
    await this.FirestoreService.getCollection<Restaurante>(environment.pathInventarioRestaurante).subscribe( res => {
      let i=1;
      this.items = [];
      res.map(async item => { 
        item.id = i++;
        item.producto = (await (item.producto as any).get()).data();
        item.producto.categoria = (await (item.producto.categoria as any).get()).data();
        item.cantidadActual = item.cantidad;
      });
      this.items = res;
    });
  }

  async subirStockProductos() {
    this.confirmationService.confirm({
        message: '¿Estás seguro que deseas subir la información?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          this.loading = true;
          let itemsAux = [] as RestauranteDTO[];
          itemsAux = this.items;
          for (const itemAux of itemsAux) {
            if(itemAux.cantidadActual !== itemAux.cantidad){
              let itemActualizar = {
                uid: itemAux.uid,
                producto: {},
                cantidad: itemAux.cantidad,
                stockmin: itemAux.stockmin
              };
              itemActualizar.producto = await this.FirestoreService.getRef(environment.pathProducto, itemAux.producto.uid);
              if (itemAux.uid){
                if(itemAux.cantidad > itemAux.cantidadActual){
                  let itemMovimiento = {
                    uid: this.FirestoreService.getId(),
                    fecha: new Date(),
                    producto: itemAux.producto,
                    cantidad: itemAux.cantidad - itemAux.cantidadActual
                  };
                  itemActualizar.cantidad = +itemAux.cantidadActual;
                  await this.FirestoreService.updateDoc(itemActualizar, environment.pathInventarioRestaurante, itemAux.uid).then(() => {
                    this.FirestoreService.createDoc(itemMovimiento, environment.pathMovimientoRestaurante, itemMovimiento.uid)
                    this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Información subida' });
                  }).catch(() => {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al subir la información', life: 3000 });
                  });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'No se puede asignar una cantidad actual mayor que la cantidad inicial', life: 3000 });
                }
              }
            }
          }
          this.loading = false;
        },
        reject: (type: ConfirmEventType) => {
          switch (type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No se subió la información' });
                  break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Has cancelado la operación' });
                  break;
          }
      }
    });
  }
}
