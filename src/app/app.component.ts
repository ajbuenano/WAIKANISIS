import { Component } from '@angular/core';
import { Producto } from './models/Producto';
import { ProductoService } from './services/producto.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'waikani';

  productos?: Producto[];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.retrieveProductos();
  }

  retrieveProductos(): void {
    this.productoService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, categoria: c.payload.doc.data().categoria.payload, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.productos = data;
      console.log("producto",this.productos)
    });
  }
}
