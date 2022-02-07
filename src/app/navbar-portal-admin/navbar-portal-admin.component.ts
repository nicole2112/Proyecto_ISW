import { Component, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import firebase from '@firebase/app-compat';
import { faUserCircle, faAddressBook, faComments, faHandSparkles } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar-portal-admin',
  templateUrl: './navbar-portal-admin.component.html',
  styleUrls: ['./navbar-portal-admin.component.css']
})
export class NavbarPortalAdminComponent implements OnInit {
  currentUser: any;
  constructor( public service: AuthenticationService, private eRef: ElementRef, private router: Router) { }
  @Input() isShow: boolean;
  @Output() viewUsersClick: EventEmitter<boolean> = new EventEmitter();
  @Output() viewTestimoniesClick = new EventEmitter();
  @Output() showTestimoniesClick = new EventEmitter();
  @Output() viewHeroesClick = new EventEmitter<boolean>();
  @Output() showHeroesClick = new EventEmitter<boolean>();
  @Output() showPDFOptions = new EventEmitter<boolean>();

  viewHeroes(){
    this.viewHeroesClick.emit(true);
  }

  showUsers(){
    this.viewUsersClick.emit(true);
  }

  showHeroes(){
    this.showHeroesClick.emit(true);
  }

  //Testimonies
  showTestimonies(){
    this.showTestimoniesClick.emit(true);
  }
  viewTestimonies(){
    this.viewTestimoniesClick.emit(true);
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
    this.router.navigateByUrl(`portal-admin/registro`);
  }

  fnEditUserProfile(){
    this.router.navigateByUrl(`portal-admin/perfil`);
  }

  logOut(){
    this.service.logout();
  }

  faUserCircle = faUserCircle;
  faAddressBook = faAddressBook;
  faComments = faComments;
  faHandSparkles = faHandSparkles;
}
