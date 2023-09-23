import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Producto, ProductoDTO } from 'src/app/shared/models/producto.interface';
import { FirestoreService } from '../../services/firestore.service';
import { environment } from 'src/environments/environment';
import { Categoria } from 'src/app/shared/models/categoria.interface';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class ProductoComponent {

  items!: Producto[];
  categorias!: Categoria[];
  loading: boolean = true;
  dialog: boolean = false;
  submitted: boolean = false;
  item!: Producto;

  async ngOnInit(): Promise<void> {
    await this.get();
    await this.getCategoria();
    this.loading = false;
  }

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
              public FirestoreService: FirestoreService) {}

  getValueEvent(event: Event){
    return (event.target as HTMLInputElement).value;
  }

  async get(){
    await this.FirestoreService.getCollection<Producto>(environment.pathProducto).subscribe( res => {
      let i=1;
      res.map(async item => { 
        item.id = i++;
        item.categoria = (await (item.categoria as any).get()).data();
      });
      this.items = res;
    });
  }

  async getCategoria(){
    await this.FirestoreService.getCollection<Categoria>(environment.pathCategoria).subscribe( res => {
      this.categorias = res;
    });
  }

  openNew() {
    this.item = {} as Producto;
    this.submitted = false;
    this.dialog = true;  
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }
  
  async save() {
    this.submitted = true;
    this.loading = true;
    let itemAux = {} as ProductoDTO;
    console.log("item",this.item);
    itemAux.nombre = this.item.nombre;
    itemAux.categoria = await this.FirestoreService.getRef(environment.pathCategoria, this.item.categoria.uid);
    if (this.item.uid){
      itemAux.uid = this.item.uid;
      await this.FirestoreService.updateDoc(itemAux, environment.pathProducto, this.item.uid).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Producto editado', life: 3000 });
      }).catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al editar el producto', life: 3000 });
      });
    } else {
      itemAux.uid = this.FirestoreService.getId();
      await this.FirestoreService.createDoc(itemAux, environment.pathProducto, itemAux.uid).then( () => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Producto creado', life: 3000 });
      }).catch( () => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al editar el producto', life: 3000 });
      });
    }
    this.loading = false;
    this.item = {} as Producto;
    this.dialog = false;
  }

  edit(item: Producto) {
    this.item = { ...item };
    this.dialog = true;
  }

  delete(item: Producto) {
    this.confirmationService.confirm({
        message: 'Esta seguro que quiere eliminar el producto ' + item.nombre + '?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async() => {
          this.loading = true;
          await this.FirestoreService.deleteDoc(environment.pathProducto, item.uid).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Producto eliminado', life: 3000 });
          }).catch(() => {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'No se puede eliminar esta producto', life: 3000 });
          });
          this.loading = false;
          this.item = {} as Producto;
        }
    });
  }
}
