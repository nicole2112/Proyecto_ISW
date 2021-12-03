import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../services/auth.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email;
  pass;
  nombre;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(
    public auth: AngularFireAuth,
    public service: AuthenticationService
  ) {}

  ngOnInit(): void {
  }

  logOut() {
    this.service.logout();
  }

  customLogin() {
   
    this.service.email = this.email;
    this.service.pass = this.pass;
    this.service.nombre = this.nombre;
    this.service.customLogin();
  }
}
