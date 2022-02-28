import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {NgSelectizeModule} from 'ng-selectize'; //categorías de blog

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
import { BlogPostComponent } from './blog-post/blog-post.component';

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
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { PwResetComponent } from './pw-reset/pw-reset.component';
import { ModalService } from './services/modal.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgregarTestimoniosComponent } from './portal-admin/agregarTestimonios.component';
import { VerTestimoniosComponent } from './portal-admin/verTestimonios.component';
import { EditUserProfileComponent } from './profiles/edit-user-profile.component';
import { HeroesAdminComponent } from './heroes-admin/heroes-admin.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { ShowHeroesAdminComponent } from './showHeroes-admin/showHeroes-admin.component';
import { NoConfirmationComponent } from './email-conf/no-confirmation/no-confirmation.component';
import { AddPdfComponent } from './add-pdf/add-pdf.component';
import { PdfServices } from './services/pdf.services';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'; //tiny mce
import { verArticulosComponent } from './portal-admin/verArticulos.component';
import { AgregarArticuloComponent } from './portal-admin/agregarArticulo.component';
import { ViewPdfsComponent } from './view-pdfs/view-pdfs.component';
import { verHistorialComponent } from './portal-digitador/verHistorial.component';
import { verFormulariosComponent } from './portal-digitador/verFormularios.component';
import { agregarSolicitudComponent } from './portal-digitador/agregarSolicitud.component';
import { DocumentsComponent } from './about-us/documents.component';
import { FechaService } from './services/fecha.service';
import { DatePipe } from '@angular/common';
import { AddPatientComponent } from './patients/addPatient.component';
import { ViewPatientsComponent } from './patients/viewPatients.component';
import { PatientHistoryComponent } from './patients/patientHistory.component';


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
    BlogPostComponent,
    FooterComponent,
    ContactUsComponent,
    LoginComponent,
    RegistroComponent,
    PortalAdminComponent,
    PortalDigitadorComponent,
    NavbarPortalAdminComponent,
    NavbarPortalDigitadorComponent,
    EditUserModalComponent,
    AgregarTestimoniosComponent,
    VerTestimoniosComponent,
    EditUserProfileComponent,
    HeroesAdminComponent,
    UsersAdminComponent,
    ShowHeroesAdminComponent,
    PwResetComponent,
    AddPdfComponent,
    NoConfirmationComponent,
    verArticulosComponent,
    AgregarArticuloComponent,
    ViewPdfsComponent,
    verHistorialComponent,
    verFormulariosComponent,
    agregarSolicitudComponent,
    DocumentsComponent,
    ViewPatientsComponent,
    AddPatientComponent,
    PatientHistoryComponent
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
    ReactiveFormsModule,
    NgbModule,
    NgSelectizeModule,
    EditorModule
  ],
  providers: [
    ModalService,
    PdfServices,
    FechaService,
    DatePipe,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
