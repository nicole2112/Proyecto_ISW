import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';//firebase
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';//firebase
import { provideDatabase,getDatabase } from '@angular/fire/database';//firebase
import { provideStorage,getStorage } from '@angular/fire/storage';//firebase

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
