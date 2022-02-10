import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { observable, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Categoria } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogRef: AngularFireList<any>;

  blogList : any[];
  categoriaList: any[];

  constructor(private db:AngularFireDatabase) { }

  getArticulos(): Observable<any[]>
  {

    this.blogRef = this.db.list('blogs');

    return this.blogRef.snapshotChanges().pipe(map(data =>{
    this.blogList = [];
    data.forEach(articulo =>{
        let a = articulo.payload.toJSON();
        a['key'] = articulo.key;
        this.blogList.push(a);
    })
    return this.blogList;
    }))
  }

  getArticulobyKey(key): Observable<any>
  {
    this.blogRef = this.db.list(`blogs/${key}`);

    return this.blogRef.snapshotChanges().pipe(map(data =>{
      return data;
    }))
  }


  postArticulo(titulo, contenido, urlimagen, descripcion, fecha, categorias:any)
  {
    let nuevoArticulo = {
      "titulo": titulo,
      "contenido": contenido,
      "fechaCreacion": fecha,
      "imagenPreview": urlimagen,
      "descripcion": descripcion,
      "categorias": categorias,
    }
    this.db.list(`blogs`).push(nuevoArticulo).then((data) =>
    {
      nuevoArticulo["id"] = data.key;
      this.db.object(`blogs/${data.key}`).set(nuevoArticulo);
    });
  }


  updateBlog(articulo, key){
    console.log(key);
    console.log(articulo);
    this.db.object(`blogs/${key}`).set(articulo).then(()=>{
      console.log("hecho");
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  getCategorias(){
    this.categoriaList =[];

    
    let categoriaRef = this.db.list('categorias');
    categoriaRef.snapshotChanges().subscribe(data =>{
        data.forEach(articulo =>{
            let a = articulo.payload.toJSON();
            a['$key'] = articulo.key;
            this.categoriaList.push(a as Categoria);
        });
    })
}

  getCategoriasArticulo(key): Observable<any[]>
  {
    this.blogRef = this.db.list(`blogs/${key}`);

    return this.blogRef.snapshotChanges().pipe(map(data =>{
    return data["categorias"];
    }));
  }

  deleteCategoriasbyArticulo(key)
  {
    let cats = this.getCategoriasArticulo(key);
    this.getArticulos();
    let borrar = [];

    cats.forEach((elem) => 
    {
      let incluido = false;
      this.blogList.forEach((articulo)=>
      {
        if(articulo["categorias"].includes(elem))
          incluido = true;
      })

      if(!incluido)
        borrar.push(elem);
    });

    borrar.forEach((n) =>
    {
      this.categoriaList.forEach((cat) =>
      {
        if(n = cat["Categoria"])
         this.db.object(`categorias/${cat["$key"]}`).set(null);
      });
    });
  }

  deleteArticulo(key){
    
    this.deleteCategoriasbyArticulo(key);
    this.db.object(`blogs/${key}`).set(null);
  }

}