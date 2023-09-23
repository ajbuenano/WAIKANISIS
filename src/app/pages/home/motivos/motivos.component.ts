import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Motivo } from 'src/app/shared/models/motivo.interface';
import { FirestoreService } from '../../services/firestore.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-motivos',
  templateUrl: './motivos.component.html',
  styleUrls: ['./motivos.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class MotivosComponent {

  items!: Motivo[];
  loading: boolean = true;
  dialog: boolean = false;
  submitted: boolean = false;
  item!: Motivo;

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
    await this.FirestoreService.getCollection<Motivo>(environment.pathMotivo).subscribe(  res => {
      let i=1;
      res.map(item => { item.id = i++ })
      this.items = res;
    });
  }

  openNew() {
    this.item = {} as Motivo;
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
      await this.FirestoreService.updateDoc(this.item, environment.pathMotivo, this.item.uid).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Motivo editado', life: 3000 });
      }).catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al editar el motivo', life: 3000 });
      });
    } else {
      this.item.uid = this.FirestoreService.getId();
      await this.FirestoreService.createDoc(this.item, environment.pathMotivo, this.item.uid).then( () => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Motivo creado', life: 3000 });
      }).catch( () => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al editar el motivo', life: 3000 });
      });
    }
    this.loading = false;
    this.item = {} as Motivo;
    this.dialog = false;
  }

  edit(item: Motivo) {
    this.item = { ...item };
    this.dialog = true;
  }

  delete(item: Motivo) {
    this.confirmationService.confirm({
        message: 'Esta seguro que quiere eliminar el motivo ' + item.nombre + '?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async() => {
          this.loading = true;
          await this.FirestoreService.deleteDoc(environment.pathMotivo, item.uid).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Motivo eliminado', life: 3000 });
          }).catch(() => {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'No se puede eliminar esta motivo', life: 3000 });
          });
          this.loading = false;
          this.item = {} as Motivo;
        }
    });
  }
}
