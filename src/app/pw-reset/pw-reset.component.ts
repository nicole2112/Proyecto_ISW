import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.services';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pw-reset',
  templateUrl: './pw-reset.component.html',
  styleUrls: ['./pw-reset.component.css']
})
export class PwResetComponent implements OnInit {

  email;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  
  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  enviarCorreo()
  {
    if(this.email == null || this.email == '')
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'El campo correo no puede estar vacio',
        showConfirmButton: false,
        timer: 3000
      })
    else
      this.authService.auth.sendPasswordResetEmail(this.email).then(() =>
      {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Correo enviado!',
          showConfirmButton: false,
          timer: 1500
        }).then(()=>{
        window.location.href = './login';
        })
      }).catch((error) =>
      {
        let message;

        switch(error['code'])
        {
          case 'auth/invalid-email':
            message = 'Error: No es un correo valido';
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
      });
    
  }

}
