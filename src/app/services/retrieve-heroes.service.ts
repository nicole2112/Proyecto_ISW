import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ModalDirective } from 'angular-bootstrap-md';
import { observable, Observable, of, from } from 'rxjs';
import { Heroe } from '../models/heroe';

@Injectable({

providedIn:'root',

})

export class RetrieveUsersService {

FundacionRef: AngularFireList<any>;
Heroes : any[];

constructor(private db:AngularFireDatabase) { }

getHeroes(): Observable<Heroe[]>{

    this.FundacionRef = this.db.list('heroes');

    this.FundacionRef.snapshotChanges().subscribe(data =>{
        this.Heroes = [];
        data.forEach(heroe =>{
            let a = heroe.payload.toJSON();
            a['$key'] = heroe.key;
            this.Heroes.push(a as Heroe);
        })
        console.table(this.Heroes);
    })
   return of(this.Heroes);
}

}