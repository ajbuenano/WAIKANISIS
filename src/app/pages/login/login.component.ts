import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(){
    const {username, password} = this.form.value;

    /*this.usersSvc.getUsers().subscribe((res) => {
      this.users = res.map((e:any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        console.log(data);
        return data;
      })
    });*/
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
          } 
        }
        else{
          alert("usuario y/o contraseña incorrectos");
        }
      });
    }
    else{
      alert("error en el formulario");
    }
  }
  
  private initForm(): void{
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }
}
