import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/auth.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  

  email = '';
  pass = '';
  nombre = '';
  rol = '';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(
    public auth: AngularFireAuth,
    public service: AuthenticationService,
    public router: Router
  ) {}

  ngOnInit(): void {
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
  
  //cambios en el guard y en login para que me agarrara el route de presidente
  logInBack(){
    this.auth.currentUser.then((res) =>{
      this.service.db.object(`usuarios/${res.uid}`).valueChanges().subscribe(item =>{
        
        if(item['rol'] == 'Presidente'){
          
          this.router.navigate(['/portal-presidente'])
        }else if(item['rol'] == 'Admin'){
          
          this.router.navigate(['/portal-admin'])
        }else{
          
          this.router.navigate(['/portal-digitador'])
        }
        
      })
    })
  }
}
