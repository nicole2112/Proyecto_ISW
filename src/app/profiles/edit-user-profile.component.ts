import { Component } from "@angular/core";
import { AuthenticationService } from "../services/auth.services";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})

export class EditUserProfileComponent {
    //Form de configuración perfil
    nombre: any;
    apellido: any;
    telefono: any;
    correo: any;
    direccion: any;
    namePattern = "^[a-zA-Z ]*$";
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    phonePattern = "^[0-9]{8}$";
    //Form de modificar contraseña
    actualPass: any;
    newPass: any;
    newPassVal: any;

    constructor(private service: AuthenticationService, public auth: AngularFireAuth){}

    ngOnInit() {
      this.nombre = sessionStorage.getItem('nombre');
      this.telefono =  sessionStorage.getItem('telefono');
      this.correo = sessionStorage.getItem('correoPer');
      this.direccion = sessionStorage.getItem('direccion');
      
      if(this.telefono === 'undefined') this.telefono = null
      if(this.correo === 'undefined') this.correo = null
      if(this.direccion === 'undefined') this.direccion = null
      console.log(sessionStorage);
    }

    async editarPerfl(){
      //editar telefono
      //editar correo personal
      //editar direccion


    }
      
}