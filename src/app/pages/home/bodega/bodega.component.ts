import { Component, inject } from '@angular/core';
import { Bodega, BodegaMovimiento } from 'src/app/shared/models/bodega.interface';
import { Motivo } from 'src/app/shared/models/motivo.interface';
import { FirestoreService } from '../../services/firestore.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Inventario } from 'src/app/shared/models/inventario.interface';
import { Restaurante, RestauranteDTO, RestauranteMovimiento } from 'src/app/shared/models/restaurante.interface';
import { Producto } from 'src/app/shared/models/producto.interface';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class BodegaComponent {

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  loading: boolean = true;
  private dataSubscription!: Subscription;  
  dialog: boolean = false;
  submitted: boolean = false;
  items!: Bodega[];
  motivos!: Motivo[];
  motivosFiltrados!: Motivo[];
  motivoSelect!: Motivo;
  itemsProductos: Producto[] = [];
  itemsInventario: Inventario[] = [];
  ProductoSelect: Inventario[] = [];
  Listaproducto: Inventario[] = [];
  
  stateOptions: any[] = [{label: 'Entrada', value: 'entrada'}, {label: 'Salida', value: 'salida'}];
  tipo: string = 'entrada';

  constructor(public FirestoreService: FirestoreService) {}

  async ngOnInit(): Promise<void> {
    await this.getMotivo();
    this.loading = false;
    await this.getProductos();
    this.getBodega();
  }

  async getBodega(){
    this.loading = true;
    let i = 1;
    for (const producto of this.itemsProductos) {
      let restaurante: Restaurante|null = null; 
      let bodega: Bodega|null = null;
      let refProducto = await this.FirestoreService.getRef(environment.pathProducto, producto.uid);
      await this.getInventarioRestauranteByProducto(refProducto).then((res: any) => {
        if (res.length != 0){
          restaurante = (res as Restaurante[])[0]
        } else {
          restaurante = {} as Restaurante;
          restaurante.uid = '';
          restaurante.cantidad = 0;
        }
        console.log("rest",res);
      });

      await this.getInventarioBodegaByProducto(refProducto).then((res: any) => {
        if (res.length != 0){
          bodega = (res as Bodega[])[0]
        } else {
          bodega = {} as Bodega;
          bodega.uid = '';
          bodega.cantidad = 0;
        }
        console.log("bod",res);
      });

      if (restaurante!=null && bodega!=null) {
  
        const item: Inventario = {
          id: i++, // Otra propiedad para identificar el producto
          producto,
          restaurante: restaurante as Restaurante,
          bodega: bodega as Bodega
        };
        console.log("item",item);
        this.itemsInventario.push(item);
      }
    }
    this.loading = false;
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
  }

  async getInventarioBodegaByProducto(refProducto:any){
    return new Promise((resolve) => {
      this.FirestoreService.getCollectionQuery(environment.pathInventarioBodega,'producto','==', refProducto).subscribe( res => {
        resolve(res);
      });
    })
  }

  async getInventarioRestauranteByProducto(refProducto:any){
    return new Promise((resolve) => {
      this.FirestoreService.getCollectionQuery(environment.pathInventarioRestaurante,'producto','==', refProducto).subscribe( res => {
        resolve(res);
      });
    })
  }

  openNew() {
    console.log("itemsInventario",this.itemsInventario)
    this.ProductoSelect = [];
    this.itemsInventario.map(x => x.total=undefined);
    this.Listaproducto = [];
    this.Listaproducto = Array.from(this.itemsInventario);
    this.submitted = false;
    this.dialog = true;  
  }

  edit(){

  }

  delete(){

  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
    this.ProductoSelect = [];
    this.itemsInventario.map(x => x.total=undefined);
  }

  async save(){
      this.confirmationService.confirm({
          message: '¿Estás seguro que deseas subir la información?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
            this.loading = true;
            
            for (const itemAux of this.ProductoSelect) {
                let itemActualizar = {
                  uid: itemAux.bodega.uid,
                  producto: await this.FirestoreService.getRef(environment.pathProducto, itemAux.producto.uid),
                  cantidad: itemAux.bodega.cantidad,
                };
                
                if (itemAux.total && itemAux.bodega.uid && itemAux.bodega.uid!=''){
                  if((itemAux.bodega.cantidad >= itemAux.total && this.tipo == 'salida') || (this.tipo == 'entrada')){
                    let itemMovimiento = {
                      uid: this.FirestoreService.getId(),
                      fecha: new Date(),
                      producto: itemActualizar.producto,
                      cantidad: itemAux.total,
                      operacion: this.tipo,
                      motivo: await this.FirestoreService.getRef(environment.pathMotivo, this.motivoSelect.uid)
                    };
                    itemActualizar.cantidad = (this.tipo=='salida') ? (itemAux.bodega.cantidad - itemAux.total) : (itemAux.bodega.cantidad + itemAux.total);
                    console.log("itemActualizar",itemActualizar)
                    await this.FirestoreService.updateDoc(itemActualizar, environment.pathInventarioBodega, itemActualizar.uid).then(() => {
                      this.FirestoreService.createDoc(itemMovimiento, environment.pathMovimientoBodega, itemMovimiento.uid)
                      this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: `Información subida del producto ${itemAux.producto.nombre}`, life: 3000 });
                      itemAux.bodega.cantidad = itemActualizar.cantidad;
                    });
                  } else{
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: `No se puede asignar una cantidad mayor que la cantidad actual en el producto ${itemAux.producto.nombre}`, life: 3000 });
                  }
                } else if (itemAux.total){
                  if((itemAux.bodega.cantidad >= itemAux.total && this.tipo == 'salida') || (this.tipo == 'entrada')){
                    let itemMovimiento = {
                      uid: this.FirestoreService.getId(),
                      fecha: new Date(),
                      producto: itemActualizar.producto,
                      cantidad: itemAux.total,
                      operacion: this.tipo,
                      motivo: await this.FirestoreService.getRef(environment.pathMotivo, this.motivoSelect.uid)
                    };
                    itemActualizar.cantidad = (this.tipo=='salida') ? itemAux.bodega.cantidad - itemAux.total : itemAux.bodega.cantidad + itemAux.total;
                    itemActualizar.uid = this.FirestoreService.getId();
                    console.log("itemActualizar",itemActualizar)
                    await this.FirestoreService.createDoc(itemActualizar, environment.pathInventarioBodega, itemActualizar.uid).then(() => {
                      this.FirestoreService.createDoc(itemMovimiento, environment.pathMovimientoBodega, itemMovimiento.uid)
                      this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: `Información subida del producto ${itemAux.producto.nombre}`, life: 3000 });
                      itemAux.bodega.cantidad = itemActualizar.cantidad;
                      itemAux.total = 0;
                    });
                  } else{
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: `No se puede asignar una cantidad mayor que la cantidad actual en el producto ${itemAux.producto.nombre}`, life: 4000 });
                  }
                }

                if (this.motivoSelect.aRestaurante && itemAux.total){
                  const restauranteAux: RestauranteDTO = {
                    uid: itemAux.restaurante.uid,
                    id: 0,
                    producto: itemActualizar.producto,
                    cantidad: itemAux.total,
                    cantidadActual: itemAux.total
                  }
                  if(itemAux.restaurante.uid == ''){
                    restauranteAux.uid = this.FirestoreService.getId();
                    await this.FirestoreService.createDoc(restauranteAux, environment.pathInventarioRestaurante, restauranteAux.uid).then(() => {
                      this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: `Producto ${itemAux.producto.nombre} enviado a restaurante`, life: 3000 });
                    });
                    itemAux.restaurante = restauranteAux;
                  } else {
                    await this.FirestoreService.updateDoc(restauranteAux, environment.pathInventarioRestaurante, restauranteAux.uid).then(() => {
                      this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: `Producto ${itemAux.producto.nombre} enviado a restaurante`, life: 3000 });
                      itemAux.restaurante = restauranteAux;
                    });
                  }
                }
            }
            this.loading = false;
            this.hideDialog();
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
  
  async getMotivo(){
    await this.FirestoreService.getCollection<Motivo>(environment.pathMotivo).subscribe(  res => {
      let i=1;
      res.map(item => { item.id = i++ })
      this.motivos = res;
      this.filtrarMotivo()
    });
  }

  filtrarMotivo(){
    if(this.tipo == 'entrada'){
      this.motivosFiltrados = this.motivos.filter(x => !x.aRestaurante)
    } else {
      this.motivosFiltrados = this.motivos;
    }
    this.ProductoSelect = [];
    this.Listaproducto = [...this.itemsInventario]; 
  }

  filtrar(){
    this.ProductoSelect = this.itemsInventario.filter(x  => x.restaurante.cantidad < x.producto.stockMinRestaurante && x.bodega.cantidad!=0);
  }

  
  getValueEvent(event: Event){
    return (event.target as HTMLInputElement).value;
  }
}
