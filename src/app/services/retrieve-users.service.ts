import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ModalDirective } from 'angular-bootstrap-md';
import { observable, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({

providedIn:'root',

})

export class RetrieveUsersService {

FundacionRef: AngularFireList<any>;
User : any[];

constructor(private db:AngularFireDatabase) { }

getUsers(): Observable<User[]>{

    this.FundacionRef = this.db.list('usuarios');

    this.FundacionRef.snapshotChanges().subscribe(data =>{
        this.User = [];
        data.forEach(user =>{
            let a = user.payload.toJSON();
            a['$key'] = user.key;
            this.User.push(a as User);
        })
        //console.table(this.User);
    });
   return of(this.User);
}

getUser(id): Observable<any>{

  this.FundacionRef = this.db.list('usuarios');

  return this.FundacionRef.snapshotChanges().pipe(map(data =>{
      let usuario:any;
      let fin = false;
      data.forEach(user =>{
          let a = user.payload.toJSON();
          if(a['id'] == id)
          {
              usuario = a;
              fin = true;
          }

      })
      //console.table(this.User);
        if(fin)
            return usuario;
        else
            return null;
    }))
}

}
