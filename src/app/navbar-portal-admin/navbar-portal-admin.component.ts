import { Component, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import { faUserCircle, faAddressBook, faComments } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-navbar-portal-admin',
  templateUrl: './navbar-portal-admin.component.html',
  styleUrls: ['./navbar-portal-admin.component.css']
})
export class NavbarPortalAdminComponent implements OnInit {

  constructor( public service: AuthenticationService, private eRef: ElementRef) { }
  @Input() isShow: boolean;
  @Output() toggleUsers: EventEmitter<boolean> = new EventEmitter();
  showUsers(){
    this.toggleUsers.emit(!this.isShow);
  }

  ngOnInit(): void {
  }
  
  logOut(){
    this.service.logout();
  }

  faUserCircle = faUserCircle;
  faAddressBook = faAddressBook;
  faComments = faComments;
}
