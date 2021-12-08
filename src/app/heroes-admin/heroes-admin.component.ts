import { Component, OnInit } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';

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

  fileList: any[];


  constructor(public service: AuthenticationService) {}

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

    heroeItem={
      "imageUrl": imageUrl,
      "nombre": this.nombre,
      "contenido": this.contenido,
      "fallecido" :this.fallecido,
      "prioridad" :this.prioridad,
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
        }).catch((error)=>{
    
        });
      }
    );

  }  







}
