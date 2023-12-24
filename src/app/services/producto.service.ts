import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Producto } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private dbPath = '/Producto';

  productoRefs: AngularFirestoreCollection<any>;

  constructor(db: AngularFirestore) {
    this.productoRefs = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<any> {
    return this.productoRefs;
  }

  create(producto: Producto): any {
    return this.productoRefs.add({ ...producto });
  }

  update(id: string, data: any): Promise<void> {
    return this.productoRefs.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.productoRefs.doc(id).delete();
  }
}
