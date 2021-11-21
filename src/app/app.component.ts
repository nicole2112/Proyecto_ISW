import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <navbar></navbar>
    <router-outlet></router-outlet>
    <footer-comp></footer-comp>
  `
})

export class AppComponent {

  localesList = [
    {code: 'en-US', label: 'English'},
    {code: 'es', label:'Español' }
  ]

  title = 'Proyecto-ISW';
}
