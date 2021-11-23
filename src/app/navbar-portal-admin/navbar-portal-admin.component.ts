import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';

@Component({
  selector: 'app-navbar-portal-admin',
  templateUrl: './navbar-portal-admin.component.html',
  styleUrls: ['./navbar-portal-admin.component.css']
})
export class NavbarPortalAdminComponent implements OnInit {

  constructor( public service: AuthenticationService) { }

  ngOnInit(): void {
  }
  
  logOut(){
    this.service.logout();
  }

}
