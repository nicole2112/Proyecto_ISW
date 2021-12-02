import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ModalDirective } from 'angular-bootstrap-md';
import { observable, Observable, of, from } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TestimonyService {

  FundacionRef: AngularFireList<any>;
  testimonyList : any[];

  constructor(private db:AngularFireDatabase) { }

  getTestimonies(): Observable<any>{

    this.FundacionRef = this.db.list('testimonios');

    return this.FundacionRef.valueChanges().pipe(data =>{
        return data;
        
    })
  }
}
