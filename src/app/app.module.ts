import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';//firebase
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';//firebase
import { provideDatabase,getDatabase } from '@angular/fire/database';//firebase
import { provideStorage,getStorage } from '@angular/fire/storage';//firebase
import { HomeComponent } from './landing-page/home.component';
import { NavbarComponent } from './nav/navbar.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './routes';
import { QueHacemosComponent } from './about-us/que-hacemos.component';
import { QuienesSomosComponent } from './about-us/quienes-somos.component';
import { ProgramasComponent } from './programs/programas.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    QuienesSomosComponent,
    QueHacemosComponent,
    ProgramasComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
