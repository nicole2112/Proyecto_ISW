import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../services/auth.services';

import Swal from 'sweetalert2'

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
  }
}
