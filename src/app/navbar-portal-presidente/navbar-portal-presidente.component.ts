import { Component, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import firebase from '@firebase/app-compat';
import { faUserCircle, faAddressBook, faComments, faHandSparkles, faBlog, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-portal-presidente',
  templateUrl: './navbar-portal-presidente.component.html',
  styleUrls: ['./navbar-portal-presidente.component.css']
})
export class NavbarPortalPresidenteComponent{
currentUser: any;
  constructor( public service: AuthenticationService, private eRef: ElementRef, private router: Router) { }
  @Input() isShow: boolean;
  @Output() viewUsersClick: EventEmitter<boolean> = new EventEmitter();
  @Output() viewTestimoniesClick = new EventEmitter();
  @Output() showTestimoniesClick = new EventEmitter();

  @Output() viewHeroesClick = new EventEmitter<boolean>();
  @Output() showHeroesClick = new EventEmitter<boolean>();

  @Output() viewPDFClick = new EventEmitter<boolean>();
  @Output() showPDFClick = new EventEmitter<boolean>();

  @Output() showArticulosClick = new EventEmitter<boolean>();
  @Output() viewArticulosClick = new EventEmitter<boolean>();

  @Output() showSolicitudesClick = new EventEmitter<boolean>();
  @Output() viewSolicitudesClick = new EventEmitter<boolean>();

  @Output() showPacientesClick = new EventEmitter<boolean>();
  @Output() viewPacientesClick = new EventEmitter<boolean>();

  viewHeroes(){
    this.viewHeroesClick.emit(true);
  }

  showUsers(){
    this.viewUsersClick.emit(true);
  }

  showHeroes(){
    this.showHeroesClick.emit(true);
  }

  //Blog
  viewArticulos() {
    this.viewArticulosClick.emit(true);
  }
  showArticulos() {
    this.showArticulosClick.emit(true);
  }

  //Testimonies
  showTestimonies(){
    this.showTestimoniesClick.emit(true);
  }
  viewTestimonies(){
    this.viewTestimoniesClick.emit(true);
  }

  //PDFs
  showPDF(){ //ver pdfs
    this.showPDFClick.emit(true);
  }
  viewPDF(){ //agregar pdfs
    this.viewPDFClick.emit(true);
  }

  //Solicitudes
  showSolicitudes(){
    this.showSolicitudesClick.emit(true);
  }
  viewSolicitudes(){
    this.viewSolicitudesClick.emit(true);
  }

  //Pacientes
  showPacientes(){
    this.showPacientesClick.emit(true);
  }
  viewPacientes(){
    this.viewPacientesClick.emit(true);
  }

  ngOnInit(): void {
    this.isLogged();
  }

  isLogged(){
    let userexp = '';
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        document.getElementById('user-display').innerHTML = '<fa-icon class="fa icons" [icon]="faUserCircle"></fa-icon>' + sessionStorage.getItem("userEmail") + ' ▼';
      }else{
        //console.log('Error');
      }
    })
    return userexp;
  }
  
  addUser(){
    this.router.navigateByUrl(`portal-presidente/registro`);
  }

  fnEditUserProfile(){
    this.router.navigateByUrl(`portal-presidente/perfil`);
  }


  logOut(){
    this.service.logout();
  }

  faUserCircle = faUserCircle;
  faAddressBook = faAddressBook;
  faComments = faComments;
  faHandSparkles = faHandSparkles;
  faFilePdf= faFilePdf;
  faBlog = faBlog;
}