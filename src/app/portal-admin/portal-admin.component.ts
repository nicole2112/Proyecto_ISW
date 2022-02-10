import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '../models/user';
import { ModalService } from '../services/modal.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getAuth, Auth } from '@firebase/auth';
import { authState } from 'rxfire/auth';
import { AuthenticationService } from '../services/auth.services';
import { Router } from "@angular/router";
import { HeroesAdminComponent } from '../heroes-admin/heroes-admin.component';
import { UsersAdminComponent } from '../users-admin/users-admin.component';
import { ShowHeroesAdminComponent } from '../showHeroes-admin/showHeroes-admin.component';

@Component({
  selector: 'app-portal-admin',
  templateUrl: './portal-admin.component.html',
  styleUrls: ['./portal-admin.component.css']
})

export class PortalAdminComponent implements OnInit {
  roleOptions = '';
  selectedValue : any;
  closeResult: string;
  User = [];
  userSelectedId : string;
  
  toggleUsers = false;

  toggleHeroes = false;
  toggleShowHeroes = false;
  toggleShowHeroesRedirect=false;

  toggleShowTestimonies=false;
  toggleViewTestimonies=false;
  toggleShowTestimoniesRedirect=false;
  toggleAddPDF=false;

  toggleShowArticulos=false; //para ver artículos
  toggleViewArticulos=false; //para agregar artículo
  toggleShowArticulosRedirect=false; //para redireccionar a ver artículos al agregar artículo


  constructor(public auth: AngularFireAuth, private db:AngularFireDatabase, private modalService: NgbModal, private _sanitizer: DomSanitizer, private router: Router) { }
  ShowUsers = false;

  toggleUsersHandler(isShow: boolean){
    this.ShowUsers = true;
    console.log(this.ShowUsers);
  }

  FundacionRef: AngularFireList<any>;
  userRef: AngularFireObject<any>;

  ngOnInit(): void {
  }

  //Para redirigir al perfil del usuario correspondiente
  fnEditUserProfile(){
    this.router.navigateByUrl(`portal-admin/perfil`);
  }
}

