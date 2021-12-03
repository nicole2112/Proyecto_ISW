import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import * as firebase from 'firebase/app';
import firebase from '@firebase/app-compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, GoogleAuthProvider, getAuth} from 'firebase/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';


import { User } from '../models/user';
import { object } from 'rxfire/database';
import { user } from '@angular/fire/auth';
import Swal from 'sweetalert2'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private userDetails: firebase.default.User = null;
    public loggedIn = false;
    email = '';
    pass = '';
    nombre: any;
    rol='';
    correoPer:any;
    direccion:any;
    telefono:any;

    constructor(
        private router: Router,
        private http: HttpClient,
        public auth: AngularFireAuth, 
        public db: AngularFireDatabase
    ) {
        this.loggedIn = !!sessionStorage.getItem('user');
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    setCurrentUser(correo: string): void {
        sessionStorage.setItem('user', correo);
        this.loggedIn = true;
    }

    isAdmin():Observable<boolean>
    {
      return this.db.object(`usuarios/${this.userDetails.uid}`).valueChanges().pipe(map((user)=>{
        if(user['rol'] === 'Admin')
          return true;
        return false;
      }));
    }
    
    isPresdente():Observable<boolean>
    {
      return this.db.object(`usuarios/${this.userDetails.uid}`).valueChanges().pipe(map((user)=>{
        if(user['rol'] === 'Presidente')
          return true;
        return false;
      }));
    }

    isAdminOrPresident():Observable<boolean>
    {
      return this.db.object(`usuarios/${this.userDetails.uid}`).valueChanges().pipe(map((user)=>{
        if(user['rol'] === 'Admin' || user['rol'] === 'Presidente')
          return true;
        return false;
      }));
    }

    customLogin() {
        if (this.email == '' || this.pass == '') {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Los campos no deben estar vacios',
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          this.auth
            .signInWithEmailAndPassword(this.email, this.pass)
            .then((res) => {
              console.log(res);
              this.router.navigate(['/portal-admin']);
              this.userDetails = res.user;

              sessionStorage.setItem('nombre', res.user.displayName);
              sessionStorage.setItem('uid', res.user.uid);
              console.log(res.user.uid);

              this.db.object(`usuarios/${res.user.uid}`).valueChanges().subscribe(item =>{
                this.correoPer = item['correoPer'];
                this.telefono = item['telefono'];
                this.direccion = item['direccion'];

                //sessionStorage.setItem('correoPer', item['correoPer']);
                //sessionStorage.setItem('telefono', item['telefono']);
                //sessionStorage.setItem('direccion', item['direccion']);
                //sessionStorage.setItem('rol', item['rol']);
              });

            })
            .catch((err) =>{
              //console.log(err);
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Correo o contraseña incorrectos...',
                showConfirmButton: false,
                timer: 1500
              })
            });
        }
    }

    logout() {
        // remove user from local storage to log user out
        //sessionStorage.removeItem('user');
        console.log(`Session storage (auth): ${sessionStorage.length}`);
        sessionStorage.clear();
        console.log(`Session storage (auth): ${sessionStorage.length}`);

        this.loggedIn = false;
        this.auth.signOut();
        this.router.navigate(['/login']);
        //Alerta
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'LogOut exitoso!',
          showConfirmButton: false,
          timer: 1500
        })
    }

    register(rol:string) {
        if (this.email == '' || this.pass == '' || this.nombre =='') {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Los campos no deben de estar vacios',
            showConfirmButton: false,
            timer: 1500
          })
        } else {
        this.auth
          .createUserWithEmailAndPassword(this.email, this.pass)
          .then(async (user) => {
            console.log(user);
            this.router.navigate(['/portal-admin']);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Usuario registrado con exito!',
              showConfirmButton: false,
              timer: 1500
            })
            let userData = {
                "id" : user.user.uid,
                "rol": rol,
                "email": this.email
            };
            (await this.db.object(`usuarios/${user.user.uid}`).set(userData));
            (await user.user.sendEmailVerification());
            (await this.auth.currentUser).updateProfile({
              displayName: this.nombre,
            });
          })
          .catch((err) => 
          {
            let message;

            switch(err['code'])
            {
              case 'auth/email-already-in-use':
                message = 'Error: Usuario ya existe';
                break;
              case 'auth/invalid-email':
                message = 'Error: No es un correo valido';
                break;
              case 'auth/weak-password':
                message = 'Error: La contraseña debe tener almenos 6 caracteres de longitud';
                break;
              default: message = 'Error';
            }

            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: message,
              showConfirmButton: false,
              timer: 3000
            })
          }
            
            );
          
        }
      }
}