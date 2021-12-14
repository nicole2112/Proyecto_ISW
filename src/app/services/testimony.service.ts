import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { observable, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getTestimonies(): Observable<any[]>{

    this.FundacionRef = this.db.list('testimonios');

    return this.FundacionRef.snapshotChanges().pipe(map(data =>{
      this.testimonyList = [];
      data.forEach(testimonio =>{
          let a = testimonio.payload.toJSON();
          a['key'] = testimonio.key;
          this.testimonyList.push(a);
      })
      return this.testimonyList;
    }))
}

  postTestimonies(testimonio)
  {
    this.db.list(`testimonios`).push(testimonio);
  }

  updateTestimonies(testimonio, key)
  {
    this.db.object(`testimonios/${key}`).set(testimonio);
  }

  
}
