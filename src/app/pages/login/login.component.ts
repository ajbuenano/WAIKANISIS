import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  constructor(){
    sessionStorage.clear();
  }

  form!: FormGroup;

  user: any;

  private readonly fb = inject(FormBuilder);
  private readonly usersSvc =  inject(UsersService);
  private readonly router =  inject(Router);
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(){
    const {username, password} = this.form.value;
    if(this.form.valid){
      this.usersSvc.getUserByUsername(username).subscribe((res) => {
        if(res.length > 0){
          this.user = res[0];
          if(this.user.contrasenia === password){
            sessionStorage.setItem('usuario', this.user.usuario);
            sessionStorage.setItem('rol', this.user.rol);
            this.router.navigate(['home']);
          }
          else{
            // Si no se encuentra ningún usuario, puedes manejarlo aquí
            this.user = null;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario y/o contraseña incorrectos.' });
          } 
        }
        else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario y/o contraseña incorrectos.' });
        }
      });
    }
    else{
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Los campos son obligatorios.' });
    }
  }
  
  private initForm(): void{
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }
}
