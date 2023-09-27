import { Component } from '@angular/core';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent {

  loading: boolean = true;
  
  dialog: boolean = false;
  submitted: boolean = false;
  
  stateOptions: any[] = [{label: 'Entrada', value: 'off'}, {label: 'Salida', value: 'on'}];
    value: string = 'off';

  openNew() {
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
  }

  async save(){
    
  }
  
}
