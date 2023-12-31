import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { FirestoreService } from '../../services/firestore.service';
import { Restaurante} from 'src/app/shared/models/restaurante.interface';
import { Subscription } from 'rxjs';
//import { Producto } from 'src/app/shared/models/producto.interface';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.component.html',
  styleUrls: ['./restaurante.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class RestauranteComponent implements OnInit, OnDestroy {

  items: Restaurante[] = [];
  public FirestoreService = inject(FirestoreService);
  private dataSubscription!: Subscription;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  loading: boolean = true;
  //itemsProductos: Producto[] = [];

  async ngOnInit(): Promise<void> {
    this.get();
    this.loading = false;
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  getValueEvent(event: Event){
    return (event.target as HTMLInputElement).value;
  }

  get() {
    this.dataSubscription = this.FirestoreService.getCollection<Restaurante>(
      environment.pathInventarioRestaurante
    ).subscribe(async (res) => {
      let i = 1;
      this.items = await Promise.all(res.map(async (item) => {
        item.id = i++;
        item.producto = (await (item.producto as any).get()).data();
        item.producto.categoria = (await (item.producto.categoria as any).get()).data();
        item.cantidadActual = item.cantidad;
        return item;
      }));
    });
  }

 /* async get(){
    this.loading = true;
    let i = 1;
    for (const producto of this.itemsProductos) {
      let restaurante: Restaurante|null = null; 
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
      if (restaurante!=null) {
  
        const item: Restaurante = {
          uid:,
          id: i++, // Otra propiedad para identificar el producto
          producto,
          cantidad,
          cantidadActual,
        };
        console.log("item",item);
        this.itemsInventario.push(item);
      }
    }
    this.loading = false;
  }

  async getInventarioRestauranteByProducto(refProducto:any){
    return new Promise((resolve) => {
      this.FirestoreService.getCollectionQuery(environment.pathInventarioRestaurante,'producto','==', refProducto).subscribe( res => {
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
        this.itemsProductos = res;
        resolve('');
      });
    })
  }*/

  async subirStockProductos() {
    this.confirmationService.confirm({
        message: '¿Estás seguro que deseas subir la información?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          this.loading = true;
          
          for (const itemAux of this.items) {
            if(itemAux.cantidadActual != itemAux.cantidad){
              let itemActualizar = {
                uid: itemAux.uid,
                producto: {},
                cantidad: itemAux.cantidad,
              };
              itemActualizar.producto = await this.FirestoreService.getRef(environment.pathProducto, itemAux.producto.uid);
              
              if (itemAux.uid){
                if(itemAux.cantidad > itemAux.cantidadActual){
                  let itemMovimiento = {
                    uid: this.FirestoreService.getId(),
                    fecha: new Date(),
                    producto: itemActualizar.producto,
                    cantidad: itemAux.cantidad - itemAux.cantidadActual
                  };
                  itemActualizar.cantidad = +itemAux.cantidadActual;
                  
                  const index = this.items.indexOf(itemAux);
                  if (index !== -1) {
                    const restauranteActualizado: Restaurante = {
                      uid: itemAux.uid,
                      id: itemAux.id,
                      producto: itemAux.producto,
                      cantidad: itemActualizar.cantidad,
                      cantidadActual: itemActualizar.cantidad
                    };
                    this.items[index] = restauranteActualizado;
                  }

                  await this.FirestoreService.updateDoc(itemActualizar, environment.pathInventarioRestaurante, itemAux.uid).then(() => {
                    this.FirestoreService.createDoc(itemMovimiento, environment.pathMovimientoRestaurante, itemMovimiento.uid)
                    this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Información subida', life: 3000 });
                  }).catch(() => {
                    itemAux.cantidadActual = itemAux.cantidad;
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al subir la información', life: 3000 });
                  });
                }
                else{
                  itemAux.cantidadActual = itemAux.cantidad;
                  this.messageService.add({ severity: 'error', summary: 'Error!', detail: `No se puede asignar una cantidad actual mayor que la cantidad inicial en el producto ${itemAux.producto.nombre}`, life: 3000 });
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
