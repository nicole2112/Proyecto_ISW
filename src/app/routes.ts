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
import { EditUserProfileComponent } from './profiles/edit-user-profile.component';

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
  {
    path: 'registro',
    component: RegistroComponent,
    canActivate: [RoleGuardGuard],
  },
  { path: 'portal-admin/perfil', component: EditUserProfileComponent },
  { path: 'portal-admin', component: PortalAdminComponent },
  { path: 'portal-pw-reset', component: PwResetComponent },
  { path: '', redirectTo: '/pagina-principal', pathMatch: 'full' },
];
