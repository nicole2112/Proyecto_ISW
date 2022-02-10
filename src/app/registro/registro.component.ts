import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../services/auth.services';

import Swal from 'sweetalert2'

import '../../assets/js/smtp.js';
declare const Email: any;
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  email = '';
  nombre = '';
  rol = '';
  pass = '';
  namePattern = '^[a-zA-Z ]*$';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(
    public auth: AngularFireAuth,
    public service: AuthenticationService
  ) {}

  ngOnInit(): void {}

  generarContra(){
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 8; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    this.pass = result;
  }

  registrar() {
    if(this.rol === ''){
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Asegúrese de seleccionar un rol',
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }
    
    this.service.email = this.email;
    this.service.pass = this.pass;
    this.service.nombre = this.nombre;
    this.service.rol = this.rol;
    this.service.register(this.rol);
    var rolSend: any;

    if(this.rol === 'Admin'){
      rolSend = 'Administrador'
    }else {
      rolSend = 'Digitador'
    }

    Email.send({
      SecureToken: "c4c2a6e5-ad26-49e5-8f8d-4468439ac72c",
      To: this.email,
      From: 'lopez.aaron1022@gmail.com',
      Subject: '¡Bienvenido a Fundacion Padrino!',
      Body: `¡Hola ${this.nombre}! Esta es tu contraseña para ingreso al portal de ${rolSend}: ${this.pass}\nInicio de Sesion: https://fundacion-padrino.web.app/login`
    }).then(
      message => console.log(message)
    );
  }
}