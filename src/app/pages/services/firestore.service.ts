import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public redodb: AngularFirestore) { }

  createDoc(data: any, path: string, id: string){
    const coleccion = this.redodb.collection(path)
    return coleccion.doc(id).set(data);
  }

  getDoc(path: string, id: string){
    const coleccion = this.redodb.collection(path)
    return coleccion.doc(id).valueChanges();
  }

  getRef(path: string, id: string){
    return this.redodb.collection(path).doc(id).ref;
  }

  deleteDoc(path: string, id: string){
    const coleccion = this.redodb.collection(path)
    return coleccion.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string){
    const coleccion = this.redodb.collection(path)
    return coleccion.doc(id).update(data);
  }

  
  getId() {
    return this.redodb.createId();
  }

  getCollection<tipo>(path: string) {
    const collection = this.redodb.collection<tipo>(path);
    return collection.valueChanges();
  }

  getCollectionQuery<tipo>(path: string, parametro: string, condicion: any, busqueda: any) {
    const collection = this.redodb.collection<tipo>(path, 
      ref => ref.where( parametro, condicion, busqueda));
    return collection.valueChanges();
  }

  getCollectionAll<tipo>(path: string, parametro: string, condicion: any, busqueda: string, startAt: any) {
    if (startAt == null) {
      startAt = new Date();
    }
    const collection = this.redodb.collectionGroup<tipo>(path, 
      ref => ref.where( parametro, condicion, busqueda)
                .orderBy('fecha', 'desc')
                .limit(1)
                .startAfter(startAt)
      );
    return collection.valueChanges();
  }

  getCollectionByDate<tipo>(path: string, startAt: any, endAt: any) {
    if (startAt == null) {
      startAt = new Date();
    }
    const collection = this.redodb.collection<tipo>(path, 
      ref => ref.where('fecha', '>=', startAt).where('fecha', '<=', endAt)
                .orderBy('fecha', 'desc')
      );
    return collection.valueChanges();
  }

  getCollectionPaginada<tipo>(path: string, limit: number, startAt: any) {
    if (startAt == null) {
      startAt = new Date();
    }
    const collection = this.redodb.collection<tipo>(path, 
      ref => ref.orderBy('fecha', 'desc')
                .limit(limit)
                .startAfter(startAt)
      );
    return collection.valueChanges();
  }
}
