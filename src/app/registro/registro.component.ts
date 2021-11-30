import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../services/auth.services';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  email = '';
  nombre = '';
  rol ='';

  constructor(public auth: AngularFireAuth,
    public service: AuthenticationService) { }

  ngOnInit(): void {
  }

  registrar(){
    this.service.email=this.email;
    this.service.nombre=this.nombre;
    this.service.rol=this.rol;
    
    this.service.register(this.rol);
  }

}
