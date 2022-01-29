import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { NavbarPortalAdminComponent } from '../navbar-portal-admin/navbar-portal-admin.component';
import { PortalAdminComponent } from '../portal-admin/portal-admin.component';
@Component({
  selector: 'app-heroes-admin',
  templateUrl: './heroes-admin.component.html',
  styleUrls: ['./heroes-admin.component.css'],
})
export class HeroesAdminComponent implements OnInit {
 
  contenido: any;
  fallecido: any; 
  nombre: any;
  prioridad: any;
  visibilidad:any;
  prioridadInt:any;
  prioridadString: any;

  fileList: any[];


  constructor(public service: AuthenticationService, public adminComp: PortalAdminComponent) {}

  @Output() viewHeroesRedirect = new EventEmitter<boolean>();

  viewHeroesRedirectFunc(){
    this.viewHeroesRedirect.emit(true);
  }

  ngOnInit(): void {}

  onDragOver(event) {
    event.preventDefault();
  }

  // From drag and drop
  onDropSuccess(event) {
      event.preventDefault();

      this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
  }

  // From attachment link
  onChange(event) {
      this.onFileChange(event.target.files);    // "target" is correct here
  }

  private onFileChange(files: File[]) {
    this.fileList = files;
    console.log(files[0].name);
  }

  getHeroeItemID(url){
    this.service.db.object('heroes').valueChanges().pipe(take(1)).subscribe(item =>{
      this.writeUserData(url); //Object.keys
    });

  }


  writeUserData(imageUrl){
    let heroeItem={};

    if(this.prioridad === 'Alta'){
      this.prioridadInt = 1,
      this.prioridadString = "Alta"
    }else if(this.prioridad === 'Media'){
      this.prioridadInt = 2,
      this.prioridadString = "Media"
    }else{
      this.prioridadInt = 3,
      this.prioridadString = "Baja"
    }

    if(this.fallecido === 'Fallecido'){
      this.fallecido = 'Fallecido'
    }else{
      this.fallecido = 'Con Vida'
    }

    heroeItem={
      "imageUrl": imageUrl,
      "nombre": this.nombre,
      "contenido": this.contenido,
      "fallecido" :this.fallecido,
      "prioridad" :this.prioridadInt,
      "prioridadString": this.prioridadString,
      "visibilidad": this.visibilidad
    }
    this.service.db.list('heroes').push(heroeItem);
  }


  saveHeroe() {
    let filename = this.fileList[0].name;
    
    const storage = getStorage();
    const storageRef = ref(storage, filename);

    uploadBytes(storageRef, this.fileList[0]).then((snapshot) => {
      
      
    }).then(
      ()=>{
        getDownloadURL(storageRef).then(data =>{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Héroe ha sido registrado exitosamente!',
            showConfirmButton: false,
            timer: 1500
          })
    
          this.getHeroeItemID(data);
          this.viewHeroesRedirectFunc();
        }).catch((error)=>{
    
        });
      }
    );
  }  







}
