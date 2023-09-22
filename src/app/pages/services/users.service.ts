import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.interface';
import { Observable, map, toArray } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private db:AngularFirestore){}

  addUser(user:User){
    user.id = this.db.createId();
    return this.db.collection('/Usuario').add(user);
  }

  getUsers(){
    return this.db.collection('/Usuario').snapshotChanges();
  }

  getUserByUsername(username:string){
    return this.db.collection('/Usuario', (ref) =>
      ref.where('usuario', '==', username)
    ).valueChanges({limit:1});
  }

  isLoggedIn(){
    return sessionStorage.getItem('usuario') != null;
  }

  getUserRole(){
    return sessionStorage.getItem('rol') != null ? sessionStorage.getItem('rol') : '';
  }
  

}
