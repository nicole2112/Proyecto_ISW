import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'pruebai18.component.html'
})
export class AppComponent {

  localesList = [
    {code: 'en-US', label: 'English'},
    {code: 'es', label:'Español' }
  ]

  title = 'Proyecto-ISW';
}
