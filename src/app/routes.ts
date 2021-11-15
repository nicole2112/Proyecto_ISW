import { Routes } from "@angular/router";
import { QuienesSomosComponent } from "./about-us/quienes-somos.component";
import { QueHacemosComponent } from "./about-us/que-hacemos.component";
import { HomeComponent } from "./landing-page/home.component";

export const AppRoutes: Routes = [
    { path: 'quienes-somos', component: QuienesSomosComponent},
    { path: 'que-hacemos', component: QueHacemosComponent},
    { path: 'pagina-principal', component: HomeComponent},
    { path: '', redirectTo:'/pagina-principal', pathMatch:'full'}
];