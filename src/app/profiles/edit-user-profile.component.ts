import { Component } from "@angular/core";
import { AuthenticationService } from "../services/auth.services";

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

    constructor(private service: AuthenticationService){}

    ngOnInit() {
      this.nombre = this.service.nombre;
      this.telefono = this.service.telefono;
      this.correo = this.service.correoPer;
      this.direccion = this.service.direccion;
    
    }
}