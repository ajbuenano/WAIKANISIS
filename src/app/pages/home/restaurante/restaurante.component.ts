import { Component } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.component.html',
  styleUrls: ['./restaurante.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class RestauranteComponent {

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  loading: boolean = true;

  confirm1() {
    this.confirmationService.confirm({
        message: '¿Estás seguro que deseas subir la información?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.messageService.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Información subida' });
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
