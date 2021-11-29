import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../services/auth.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Input() action: string;

  email = '';
  pass = '';
  nombre = '';
  rol = '';

  constructor(
    public auth: AngularFireAuth,
    public service: AuthenticationService
  ) {}

  ngOnInit(): void {
    console.log(this.action);
  }

  logOut() {
    this.service.logout();
  }

  customLogin() {
   
    this.service.email = this.email;
    this.service.pass = this.pass;
    this.service.nombre = this.nombre;
    this.service.rol = this.rol;
    this.service.customLogin();
  }
}
