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
  static getBlogById(idBlog: any): any {
      throw new Error("Method not implemented.");
  }

  blogRef: AngularFireList<any>;

  blogList : any[];
  categoryList: any[];

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
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  getCategoriasSnapshot(){
    this.categoryList =[];

    
    let categoriaRef = this.db.list('categorias');
    categoriaRef.snapshotChanges().subscribe(data =>{
        data.forEach(articulo =>{
            let a = articulo.payload.toJSON();
            a['$key'] = articulo.key;
            this.categoryList.push(a as Categoria);
        });
    })
}

  getCategoriasArticulo(key): Observable<any[]>
  {
    this.blogRef = this.db.list(`blogs/${key}`);

    return this.blogRef.snapshotChanges().pipe(map(data =>{
      let catlist = [];
      data.forEach(cat =>{
          if(cat.key === "categorias")
          {
            let a = cat.payload.toJSON();
            catlist.push(a);
          }
      })
    return catlist;
    }));
  }

  deleteCategoriasbyArticulo(key)
  {
    this.getCategoriasSnapshot();
    this.getCategoriasArticulo(key).subscribe((catos) => {

      let cats = Object.values(catos[0]);
      this.db.object(`blogs/${key}`).set(null);
      let borrar = [];

      for(let elem of cats)
      {
        let incluido = false;
        this.blogList.forEach((articulo)=>
        {
          let art = Object.values(articulo["categorias"]);
          if(art.includes(elem) && articulo["id"]!= key)
            incluido = true;
        })

        if(!incluido)
          borrar.push(elem);
      }

      borrar.forEach((n) =>
      {
        this.categoryList.forEach((cat) =>
        {
          if(n == cat["Categoria"])
          this.db.object(`categorias/${cat["$key"]}`).set(null);
        });
      });
    });
    
  }

  deleteArticulo(key){
    this.deleteCategoriasbyArticulo(key);
  }

  getBlogById(idBlog){
    return this.db.object(`blogs/${idBlog}`).valueChanges();
  }
  
}