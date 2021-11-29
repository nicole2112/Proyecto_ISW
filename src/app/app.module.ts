import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';//firebase
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';//firebase
import { provideDatabase,getDatabase } from '@angular/fire/database';//firebase
import { provideStorage,getStorage } from '@angular/fire/storage';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './routes';
import { QueHacemosComponent } from './about-us/que-hacemos.component';
import { QuienesSomosComponent } from './about-us/quienes-somos.component';
import { HeroesComponent } from './heroes/heroes.component';
import { ProgramasComponent } from './programs/programas.component';
import { DonationsComponent } from './donations/donations.component';
import { TestimoniesComponent } from './testimonies/testimonies.component';
import { BlogComponent } from './blog/blog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

import { LoginComponent } from './login/login.component';
import { AngularFireDatabase, AngularFireDatabaseModule, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlianzasComponent } from './about-us/alianzas.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { RegistroComponent } from './registro/registro.component';
import { PortalAdminComponent } from './portal-admin/portal-admin.component';
import { PortalDigitadorComponent } from './portal-digitador/portal-digitador.component';
import { HomeComponent } from './landing-page/home.component';
import { NavbarComponent } from './nav/navbar.component';
import { NavbarPortalAdminComponent } from './navbar-portal-admin/navbar-portal-admin.component';
import { NavbarPortalDigitadorComponent } from './navbar-portal-digitador/navbar-portal-digitador.component';
import { PwResetComponent } from './pw-reset/pw-reset.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    QuienesSomosComponent,
    QueHacemosComponent,
    AlianzasComponent,
    ProgramasComponent,
    HeroesComponent,
    DonationsComponent,
    TestimoniesComponent,
    BlogComponent,
    FooterComponent,
    ContactUsComponent,
    LoginComponent,
    RegistroComponent,
    PortalAdminComponent,
    PortalDigitadorComponent,
    NavbarPortalAdminComponent,
    NavbarPortalDigitadorComponent,
    PwResetComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
