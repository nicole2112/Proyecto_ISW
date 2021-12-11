import { Component, OnInit } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ignoreElements, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Heroe } from '../models/heroe';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { empty } from 'rxjs';

@Component({
  selector: 'app-showHeroes-admin',
  templateUrl: './showHeroes-admin.component.html',
  styleUrls: ['./showHeroes-admin.component.css'],
})
export class ShowHeroesAdminComponent implements OnInit {
 
  contenido: any;
  fallecido: any; 
  nombre: any;
  prioridad: any;
  visibilidad:any;
  imageUrl: any;

  fileList: any[];

  heroeSelectedId: string;
  heroeSelectedImg: string;
  heroeSelectedName: string
  Heroe = [];
  closeResult: string;
  selectedValue : any;
  imgUrlSave: any;

  checkVisibilidad : boolean;
  checkPrioridad : boolean;
  checkFallecido : boolean;

  constructor(public service: AuthenticationService, private db:AngularFireDatabase, private modalService: NgbModal) {}
  FundacionRef: AngularFireList<any>;
  heroeRef: AngularFireObject<any>;

  ngOnInit(): void {
    this.FundacionRef = this.db.list('heroes');

        this.FundacionRef.snapshotChanges().subscribe(data =>{
        this.Heroe = [];
        data.forEach(heroe => {
            let a = heroe.payload.toJSON();
            a['$key'] = heroe.key;
            this.Heroe.push(a as Heroe);
        })
        })
  }

  open(content, id: string, name: string) {
    this.heroeSelectedId = id;
    this.heroeSelectedName = name;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSelect(selectedItem: any, img: string){
    this.heroeSelectedImg = selectedItem.imageUrl;
    document.getElementById("nombre").setAttribute('value', selectedItem.nombre);
    document.getElementById("contenido").innerHTML = selectedItem.contenido;

    var selectorVisibilidad = document.getElementById("visibilidadOptions");
    var optionVisibilidad = document.createElement("option");
    var optionVisibilidad2 = document.createElement("option");

    optionVisibilidad.innerHTML = selectedItem.visibilidad;
    optionVisibilidad.selected = true;
    selectorVisibilidad.appendChild(optionVisibilidad);
    if(selectedItem.visibilidad === 'publico')
    {
      optionVisibilidad2.innerHTML = "privado"
    }else{
      optionVisibilidad2.innerHTML = "publico"
    }

    selectorVisibilidad.appendChild(optionVisibilidad2);

    var selectorPrioridad = document.getElementById("prioridadOptions");
    var optionPrioridad1 = document.createElement("option");
    var optionPrioridad2 = document.createElement("option");
    var optionPrioridad3 = document.createElement("option");

    

    if(selectedItem.prioridad == 1)
    {
      optionPrioridad1.innerHTML = "Alta";
      optionPrioridad1.selected = true;
    
      optionPrioridad2.innerHTML = "Media"
      optionPrioridad3.innerHTML = "Baja"
      
    }else if(selectedItem.prioridad == 2){
      optionPrioridad1.innerHTML = "Media";
      optionPrioridad1.selected = true;

      optionPrioridad2.innerHTML = "Alta"
      optionPrioridad3.innerHTML = "Baja"
    }else{
      optionPrioridad1.innerHTML = "Baja";
      optionPrioridad1.selected = true;

      optionPrioridad2.innerHTML = "Alta"
      optionPrioridad3.innerHTML = "Media"
    }
    selectorPrioridad.appendChild(optionPrioridad1);
    selectorPrioridad.appendChild(optionPrioridad2);
    selectorPrioridad.appendChild(optionPrioridad3);

    var selectorFallecido = document.getElementById("fallecidoOptions");
    var optionFallecido = document.createElement("option");
    var optionFallecido2 = document.createElement("option");

    optionFallecido.innerHTML = selectedItem.fallecido;
    optionFallecido.selected = true;
    selectorFallecido.appendChild(optionFallecido);
    if(selectedItem.fallecido === "si")
    {
      optionFallecido2.innerHTML = "no"
      selectorFallecido.appendChild(optionFallecido2);
    }else{
      optionFallecido2.innerHTML = "si"
      selectorFallecido.appendChild(optionFallecido2);
    }
    
  }

  deleteHeroe(){
    this.heroeRef = this.db.object('heroes/' + this.heroeSelectedId);
    this.heroeRef.remove();
  }

  onDeleteConfirmation(name: string){
    document.getElementById("nameDelete").setAttribute('value', name);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onDragOver(event) {
    event.preventDefault();
  }

  // From drag and drop
  onDropSuccess(event) {
      event.preventDefault();

      this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
  }

  // From attachment link
  onChangeFile(event) {
      this.onFileChange(event.target.files);    // "target" is correct here
  }

  private onFileChange(files: File[]) {
    this.fileList = files;
  }

  callUpdateNotification(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Héroe ha sido actualizado exitosamente!',
      showConfirmButton: false,
      timer: 1500
    })
  }

  writeUserData(imageUrl, heroeSelectedId){
    let heroeItem={};
    const userRef = this.db.object('heroes/' + heroeSelectedId);

      heroeItem={
        "imageUrl": imageUrl,
        "nombre": this.nombre,
        "contenido": this.contenido,
        "fallecido" :this.fallecido,
        "prioridad" :this.prioridad,
        "visibilidad": this.visibilidad
      }
    userRef.update(heroeItem)
    this.callUpdateNotification();
  }

  getValues(){
    var nombreVal = document.getElementById('nombre') as HTMLInputElement;
    var contenidoVal = document.getElementById('contenido') as HTMLTextAreaElement;
    var visibilidadVal = document.getElementById('visibilidadOptions') as HTMLSelectElement;
    var fallecidoVal = document.getElementById('fallecidoOptions') as HTMLSelectElement;
    var prioridadVal = document.getElementById('prioridadOptions') as HTMLSelectElement;

    let nombreValue = nombreVal.value;
    let contenidoValue = contenidoVal.value;
    let visibilidadValue = visibilidadVal.options[visibilidadVal.selectedIndex].text;
    let prioridadValue = prioridadVal.options[prioridadVal.selectedIndex].text;
    let fallecidoValue = fallecidoVal.options[fallecidoVal.selectedIndex].text;

    var prioridadSend;
    let updateValue = {};

    if(prioridadValue === 'Alta'){
      prioridadSend = 1
    }else if(prioridadValue === 'Media'){
      prioridadSend = 2
    }else{
      prioridadSend = 3
    }

    this.nombre = nombreValue;
    this.contenido =  contenidoValue;
    this.visibilidad = visibilidadValue;
    this.fallecido = fallecidoValue;
    this.prioridad= prioridadSend;
  }

  saveHeroe() {
    this.getValues();
    if(this.fileList != undefined  && this.fileList.length > 0)
    {
    let filename = this.fileList[0].name;
    const storage = getStorage();
    const storageRef = ref(storage, filename);
    
    
      uploadBytes(storageRef, this.fileList[0]).then((snapshot) => {

      }).then(
         ()=>{
          getDownloadURL(storageRef).then(data =>{
            this.writeUserData(data, this.heroeSelectedId) 
          }).catch((error)=>{
            console.log(error)
          });
        }
      );
    }else{
      this.writeUserData(this.heroeSelectedImg, this.heroeSelectedId)
    }
  }  
}