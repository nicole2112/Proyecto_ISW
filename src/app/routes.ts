import { ViewChild } from '@angular/core';
import { Routes } from '@angular/router';
import { QuienesSomosComponent } from './about-us/quienes-somos.component';
import { QueHacemosComponent } from './about-us/que-hacemos.component';
import { HomeComponent } from './landing-page/home.component';
import { HeroesComponent } from './heroes/heroes.component';
import { DonationsComponent } from './donations/donations.component';
import { ProgramasComponent } from './programs/programas.component';
import { TestimoniesComponent } from './testimonies/testimonies.component';
import { BlogComponent } from './blog/blog.component';
import { AlianzasComponent } from './about-us/alianzas.component';
import { AppComponent } from './app.component';
import { RoleGuardGuard } from './guards/role-guard.guard';
import { LoginComponent } from './login/login.component';
import { PortalAdminComponent } from './portal-admin/portal-admin.component';
import { RegistroComponent } from './registro/registro.component';
import { PwResetComponent } from './pw-reset/pw-reset.component';
import { EmailConfGuard } from './email-conf/guard/email-conf.guard';
import { NoConfirmationComponent } from './email-conf/no-confirmation/no-confirmation.component';
import { PortalDigitadorComponent } from './portal-digitador/portal-digitador.component';
import { EditUserProfileComponent } from './profiles/edit-user-profile.component';
import { HeroesAdminComponent } from './heroes-admin/heroes-admin.component';
import { AdminConfGuard } from './email-conf/guard/admin-conf.guard';
import { DigitadorConfGuard } from './email-conf/guard/digitador-conf.guard';
import { AddPdfComponent } from './add-pdf/add-pdf.component';

export const AppRoutes: Routes = [
  { path: 'quienes-somos', component: QuienesSomosComponent },
  { path: 'que-hacemos', component: QueHacemosComponent },
  { path: 'alianzas', component: AlianzasComponent },
  { path: 'pagina-principal', component: HomeComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'donations', component: DonationsComponent },
  { path: 'programas', component: ProgramasComponent },
  { path: 'testimonies', component: TestimoniesComponent },
  { path: 'blog', component: BlogComponent },
  {path: 'login', component: LoginComponent },
  {path: 'heroes-admin', component: HeroesAdminComponent, canActivate: [AdminConfGuard]},
  {
    path: 'portal-admin/registro',
    component: RegistroComponent,
    canActivate: [AdminConfGuard],
  },
  { path: 'portal-admin', component: PortalAdminComponent, canActivate: [AdminConfGuard] },
  {path: 'no-email-confirmation', component: NoConfirmationComponent},
  { path: 'portal-admin/perfil', component: EditUserProfileComponent, canActivate: [AdminConfGuard] },
  { path: 'portal-digitador', component: PortalDigitadorComponent, canActivate: [DigitadorConfGuard]},
  { path: 'portal-pw-reset', component: PwResetComponent },
  {path: 'agregarPDF', component: AddPdfComponent},
  //{ path: 'agregarTestimonio', component: AgregarTestimoniosComponent, canActivate: [AdminConfGuard] },
  //{ path: 'verTestimonio', component: VerTestimoniosComponent, canActivate: [AdminConfGuard] },
  { path: '', redirectTo: '/pagina-principal', pathMatch: 'full' },
];
