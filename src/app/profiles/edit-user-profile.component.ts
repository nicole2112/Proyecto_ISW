import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import { user } from 'rxfire/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { getAuth } from '@angular/fire/auth';

@Component({
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css'],
})
export class EditUserProfileComponent implements OnInit {
  //Form de configuración perfil
  nombre: any;
  correo: any;
  rol: any;
  telefono: any;
  correoPersonal: any;
  direccion: any;
  namePattern = '^[a-zA-Z ]*$';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  phonePattern = '^[0-9]{8}$';
  userId: any;
  router: any;

  reload: boolean;

  constructor(
    private service: AuthenticationService,
    public auth: AngularFireAuth
  ) {}



  ngOnInit() {
    this.telefono = sessionStorage.getItem('telefono');
    this.correoPersonal = sessionStorage.getItem('correoPer');
    this.direccion = sessionStorage.getItem('direccion');

    if (this.telefono === 'undefined') this.telefono = null;
    if (this.correoPersonal === 'undefined') this.correoPersonal = null;
    if (this.direccion === 'undefined') this.direccion = null;
    console.log(sessionStorage);

      this.userId = getAuth().currentUser.uid;
      console.log(this.userId);
      this.correo = getAuth().currentUser.email;
    


    this.obtenerRol();

  }//fin de ngOnInit

  async obtenerRol(){
    this.service.db
      .list('usuarios')
      .valueChanges()
      .subscribe((usuarios) => {
        let keys = Object.keys(usuarios);
        //console.log(usuarios);
        keys.forEach((item) => {
          if (usuarios[item]['id'] == this.userId) {
            this.rol = usuarios[item]['rol'];
            console.log(this.rol);
          }
        });
      });
  }


  async editarPerfl() {
    //editar nombre
    if (this.nombre != '') {
      (await this.auth.currentUser).updateProfile({
        displayName: this.nombre,
      });
    }
    this.writeUserData();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Perfil actualizado!',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  writeUserData() {
    const db = getDatabase();
    set(ref(db, 'usuarios/' + this.userId), {
      "id": this.userId,
      "rol": this.rol,
      "email": this.correo,
      "correoPer": this.correoPersonal,
      "telefono": this.telefono,
      "direccion": this.direccion
    });
  }
}
