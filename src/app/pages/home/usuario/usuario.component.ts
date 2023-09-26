import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/shared/models/user.interface';
import { FirestoreService } from '../../services/firestore.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class UsuarioComponent {
  items!: User[];
  loading: boolean = true;
  dialog: boolean = false;
  submitted: boolean = false;
  item!: User;

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
    await this.FirestoreService.getCollection<User>(environment.pathUser).subscribe(  res => {
      let i=1;
      res.map(item => { item.id = i++ })
      this.items = res;
    });
  }

  openNew() {
    this.item = {} as User;
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
      await this.FirestoreService.updateDoc(this.item, environment.pathUser, this.item.uid).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Usuario editado', life: 3000 });
      }).catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al editar el usuario', life: 3000 });
      });
    } else {
      this.item.uid = this.FirestoreService.getId();
      await this.FirestoreService.createDoc(this.item, environment.pathUser, this.item.uid).then( () => {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Usuario creado', life: 3000 });
      }).catch( () => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al editar el usuario', life: 3000 });
      });
    }
    this.loading = false;
    this.item = {} as User;
    this.dialog = false;
  }

  edit(item: User) {
    this.item = { ...item };
    this.dialog = true;
  }

  delete(item: User) {
    this.confirmationService.confirm({
        message: 'Esta seguro que quiere eliminar el usuario ' + item.nombre + '?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async() => {
          this.loading = true;
          await this.FirestoreService.deleteDoc(environment.pathUser, item.uid).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: 'Usuario eliminado', life: 3000 });
          }).catch(() => {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'No se puede eliminar esta usuario', life: 3000 });
          });
          this.loading = false;
          this.item = {} as User;
        }
    });
  }
}
