import { Component, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import firebase from '@firebase/app-compat';
import { faUserCircle, faAddressBook, faComments } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-navbar-portal-admin',
  templateUrl: './navbar-portal-admin.component.html',
  styleUrls: ['./navbar-portal-admin.component.css']
})
export class NavbarPortalAdminComponent implements OnInit {
  currentUser: any;
  constructor( public service: AuthenticationService, private eRef: ElementRef) { }
  @Input() isShow: boolean;
  @Output() toggleUsers: EventEmitter<boolean> = new EventEmitter();
  showUsers(){
    this.toggleUsers.emit(!this.isShow);
  }

  ngOnInit(): void {
    this.isLogged();
  }

  isLogged(){
    let userexp = '';
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        document.getElementById('user-display').innerHTML = '<fa-icon class="fa icons" [icon]="faUserCircle"></fa-icon>' + user.email + ' ▼';
      }else{
        console.log('Error');
      }
    })
    console.log(userexp);
    return userexp;
  }
  
  logOut(){
    this.service.logout();
  }

  faUserCircle = faUserCircle;
  faAddressBook = faAddressBook;
  faComments = faComments;
}
