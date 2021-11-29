import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '../models/user';
@Component({
  selector: 'app-portal-admin',
  templateUrl: './portal-admin.component.html',
  styleUrls: ['./portal-admin.component.css']
})

export class PortalAdminComponent implements OnInit {

  User = [];

  constructor(public auth: AngularFireAuth, private db:AngularFireDatabase, private eRef: ElementRef) { }
  ShowUsers = false;

  toggleUsersHandler(isShow: boolean){
    this.ShowUsers = true;
    console.log(this.ShowUsers);
  }

  FundacionRef: AngularFireList<any>;

  ngOnInit(): void {
    this.FundacionRef = this.db.list('usuarios');

    this.FundacionRef.snapshotChanges().subscribe(data =>{
      this.User = [];
      data.forEach(user => {
        let a = user.payload.toJSON();
        a['$key'] = user.key;
        this.User.push(a as User);
      })
      console.table(this.User);
    })
  }
}
