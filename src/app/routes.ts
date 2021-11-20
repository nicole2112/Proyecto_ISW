import { Routes } from "@angular/router";
import { QuienesSomosComponent } from "./about-us/quienes-somos.component";
import { QueHacemosComponent } from "./about-us/que-hacemos.component";
import { HomeComponent } from "./landing-page/home.component";
import { HeroesComponent } from "./heroes/heroes.component";
import { DonationsComponent } from "./donations/donations.component";
import { ProgramasComponent } from "./programs/programas.component";
import { TestimoniesComponent } from "./testimonies/testimonies.component";
import { BlogComponent } from "./blog/blog.component";
import { LoginComponent } from "./login/login.component";

export const AppRoutes: Routes = [
    { path: 'registro', component: LoginComponent},
    { path: 'quienes-somos', component: QuienesSomosComponent},
    { path: 'que-hacemos', component: QueHacemosComponent},
    { path: 'pagina-principal', component: HomeComponent},
    { path: 'heroes', component: HeroesComponent},
    { path: 'donations', component: DonationsComponent},
    { path: 'programas', component: ProgramasComponent},
    { path: 'testimonies', component: TestimoniesComponent},
    { path: 'blog', component: BlogComponent},
    { path: '', redirectTo:'/pagina-principal', pathMatch:'full'}
];