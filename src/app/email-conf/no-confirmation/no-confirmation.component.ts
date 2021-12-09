import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-no-confirmation',
  templateUrl: './no-confirmation.component.html',
  styleUrls: ['./no-confirmation.component.css']
})
export class NoConfirmationComponent implements OnInit {

  constructor(private authservice: AuthenticationService) { }

  ngOnInit(): void {
  }

  reenviarCorreo()
  {
    this.authservice.sendConfirmationEmail();
    this.authservice.logoutVerificacion();
    
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Correo enviado!',
      showConfirmButton: false,
      timer: 1500
    })
  }

}
