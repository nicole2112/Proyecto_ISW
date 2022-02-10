import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { observable, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  static getBlogById(idBlog: any): any {
      throw new Error("Method not implemented.");
  }

  FundacionRef: AngularFireList<any>;
  blogList : any[];
  categoryList: any[];

  constructor(private db:AngularFireDatabase) { }

  getArticulos(): Observable<any[]>
  {

    this.FundacionRef = this.db.list('blogs');

    return this.FundacionRef.snapshotChanges().pipe(map(data =>{
      this.blogList = [];
      data.forEach(articulo =>{
          let a = articulo.payload.toJSON();
          a['key'] = articulo.key;
          this.blogList.push(a);
      })
      return this.blogList;
    }))
  }


  postArticulo(titulo, contenido, urlimagen, descripcion, fecha)
  {
    let nuevoArticulo = {
      "titulo": titulo,
      "contenido": contenido,
      "fechaCreacion": fecha,
      "imagenPreview": urlimagen,
      "descripcion": descripcion,
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

  deleteArticulo(key){
    this.db.object(`blogs/${key}`).set(null);
  }

  getBlogById(idBlog){
    return this.db.object(`blogs/${idBlog}`).valueChanges();
  }

  getCategorias(){
    this.FundacionRef = this.db.list('categorias');

    return this.FundacionRef.snapshotChanges().pipe(map(data =>{
      this.categoryList = [];
      data.forEach(articulo =>{
          let a = articulo.payload.toJSON();
          a['key'] = articulo.key;
          this.categoryList.push(a);
      })
      return this.categoryList;
    }))
  }
  
}