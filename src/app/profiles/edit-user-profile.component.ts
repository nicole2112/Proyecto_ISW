import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import { user } from 'rxfire/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { ActivatedRoute, Router } from '@angular/router';
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
  //router: any;

  reload: boolean;

  constructor(  
              private router: Router,
              private service: AuthenticationService,
              public auth: AngularFireAuth) {}


  ngOnInit() 
  {
    this.userId = sessionStorage.getItem('uid');
    
    this.service.db
      .list('usuarios')
      .valueChanges()
      .subscribe((usuarios) => {
        let keys = Object.keys(usuarios);
        keys.forEach((item) => {
          if (usuarios[item]['id'] == this.userId) {
            this.correoPersonal = usuarios[item]['correoPer'];
            this.direccion = usuarios[item]['direccion'];
            this.correo = usuarios[item]['email'];
            this.rol = usuarios[item]['rol'];
            this.telefono = usuarios[item]['telefono'];

          }
        });
      });
    this.nombre = sessionStorage.getItem('nombre');

    console.log( getAuth().currentUser); //retorna null al recargar página

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

    if (this.telefono == undefined ) this.telefono = '';
    if (this.correoPersonal == undefined) this.correoPersonal = '';
    if (this.direccion == undefined) this.direccion = '';
    this.writeUserData(); //editar otros datos

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Perfil actualizado exitosamente',
      showConfirmButton: false,
      timer: 1500,
    });
    this.router.navigate(['/portal-admin']);
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
