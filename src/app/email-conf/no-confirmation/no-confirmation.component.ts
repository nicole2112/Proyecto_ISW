import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.services';

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
  }

}
