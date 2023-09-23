import { Component } from '@angular/core';
import { Categoria } from 'src/app/shared/models/categoria.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FirestoreService } from '../../services/firestore.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CategoriaComponent {
  items!: Categoria[];
  loading: boolean = true;
  dialog: boolean = false;
  submitted: boolean = false;
  item!: Categoria;

  async ngOnInit(): Promise<void> {
    await this.get();
    this.loading = false;
  }

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
              public FirestoreService: FirestoreService) {}

  getValueEvent(event: Event){
    return (event.target as HTMLInputElement).value;
  }

  async get(){
    await this.FirestoreService.getCollection<Categoria>(environment.pathCategoria).subscribe(  res => {
      let i=1;
      res.map(item => { item.id = i++ })
      this.items = res;
    });
  }

  openNew() {
    this.item = {} as Categoria;
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
    if (this.item.uid){
      await this.FirestoreService.updateDoc(this.item, environment.pathCategoria, this.item.uid).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Categoría editada', life: 3000 });
      }).catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al editar la categoría', life: 3000 });
      });
    } else {
      this.item.uid = this.FirestoreService.getId();
      await this.FirestoreService.createDoc(this.item, environment.pathCategoria, this.item.uid).then( () => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Categoría creada', life: 3000 });
      }).catch( () => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al editar la categoría', life: 3000 });
      });
    }
    this.loading = false;
    this.item = {} as Categoria;
    this.dialog = false;
  }

  edit(item: Categoria) {
    this.item = { ...item };
    this.dialog = true;
  }

  delete(item: Categoria) {
    this.confirmationService.confirm({
        message: 'Esta seguro que quiere eliminar la categoría ' + item.nombre + '?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async() => {
          this.loading = true;
          await this.FirestoreService.deleteDoc(environment.pathCategoria, item.uid).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Categoría eliminada', life: 3000 });
          }).catch(() => {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'No se puede eliminar esta categoría', life: 3000 });
          });
          this.loading = false;
          this.item = {} as Categoria;
        }
    });
  }
}
