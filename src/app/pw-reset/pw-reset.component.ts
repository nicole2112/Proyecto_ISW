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

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  enviarCorreo()
  {
    this.authService.auth.sendPasswordResetEmail(this.email);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Correo enviado!',
      showConfirmButton: false,
      timer: 1500
    }).then(()=>{
    window.location.href = './login';
    })
  }

}
