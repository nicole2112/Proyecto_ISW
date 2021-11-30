import { Component } from "@angular/core";
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

    constructor(public auth: AngularFireAuth){}

    ngOnInit(): void{}


    async editarPerfl(){
      //editar telefono

      //editar direccion

      //editar correo personal
    }

}