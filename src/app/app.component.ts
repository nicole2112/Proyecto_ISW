import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  template: `
    <!-- <navbar></navbar> -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'Proyecto-ISW';
}
