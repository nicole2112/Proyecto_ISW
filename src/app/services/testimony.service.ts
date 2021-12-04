import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { observable, Observable, of, from } from 'rxjs';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class TestimonyService {

  FundacionRef: AngularFireList<any>;
  testimonyList : any[];

  constructor(private db:AngularFireDatabase) { }

  emptyCheck(obj)
  {
    if(
      obj 
      && Object.keys(obj).length === 0
      && Object.getPrototypeOf(obj) === Object.prototype
    ) return true;
    
      return false;
  }

  getTestimonies(): Observable<any>{

    this.FundacionRef = this.db.list('testimonios');

    return this.FundacionRef.valueChanges().pipe(data =>{
        return data;
        
    })
  }

  postTestimonies(testimonio)
  {
    this.db.object(`testimonios/${testimonio.titulo.replace(/\s+/g, '_').toLowerCase()}`).set(testimonio);
  }

  editarTestomonio(nombre, visible)
  {
    let testimonio: any;
    this.db.object(`testimonios/${nombre.replace(/\s+/g, '_').toLowerCase()}`).snapshotChanges().subscribe((T) =>{
        testimonio = T;
    });
    if(!this.emptyCheck(testimonio))
    {
      testimonio.visible = visible;
      this.postTestimonies(testimonio);
    }
    else
      {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: "No se encotro el testimonio",
          showConfirmButton: false,
          timer: 1500
        });
      }
    
  }
  
}
