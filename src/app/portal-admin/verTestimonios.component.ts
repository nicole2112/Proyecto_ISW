import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TestimonyService } from "../services/testimony.service";
import { ModalService } from '../services/modal.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ignoreElements, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.services';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
//import { Heroe } from '../models/heroe';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { empty } from 'rxjs';

@Component ({
    selector: 'app-view-testimonies-admin',
    templateUrl: './verTestimonios.component.html',
    styleUrls: ['verTestimonios.component.css']
})

export class VerTestimoniosComponent implements OnInit{
    testimonyList : any[];
    NuevaLista: any[] = [];
    closeResult: any;
    urlList : string[];
    url;
    titulo;
    visible;
    prioridad;
    userSelectedId : string;
    estado="Disponible";
    opciones = ["Disponible", "Ocultar"];
    opcionesPrioridad =["Alta", "Media", "Baja"];
    Disponible = "Disponible";
    Ocultar = "Ocultar";
    currentKey:string;
    constructor(private testimService: TestimonyService, private _sanitizer: DomSanitizer,private modalService: NgbModal, private db:AngularFireDatabase)
    {

    }

    onSelectedChange(event:any)
    {
        
        console.log(event.target.value);
        this.estado = event.target.value;
        console.log("ESTADO ACA xx")
        console.log("ESTADO ACA " + this.estado)
    }

    onSelectedChange2(event:any)
    {
        console.log(event.target.value);
        this.titulo = event.target.value;
    }

    onSelectedPriorityChange(event:any)
    {
        this.prioridad = event.target.value;
        console.log(this.prioridad);
    }
    onSelectedChange3(event:any)
    {
        console.log(event.target.value);
        this.prioridad = event.target.value;
    }


    ShowTestimonies = false;
    toggleTestimoniesHandler(isShow: boolean){
      this.ShowTestimonies = true;
      console.log(this.ShowTestimonies);
    }

    ngOnInit(): void {
        // this.testimService.getTestimonies().subscribe((item) => {
        //     console.log(item);
        //     this.testimonyList = item;
        // });
        this.testimService.getTestimonies().subscribe((item) => {
       
          this.testimonyList = item;
          this.titulo = item[0].titulo;
          this.testimonyList.sort((a,b) => (a.prioridad > b.prioridad) ? 1 : ((b.prioridad > a.prioridad) ? -1 : 0));

          this.testimonyList.forEach(element => {

              if(element.visible == 1){
                  element.visible ="Disponible";
              }else{
                  element.visible ="Oculto";
              } 
              
              if(element.prioridad == 1){
                  element.prioridad ="Alta";
              }else if (element.prioridad == 2){
                  element.prioridad = "Media";
              }else if(element.prioridad == 3){
                  element.prioridad = "Baja"
              }
              this.NuevaLista.push(element);
          });

          //this.testimonyList = item;
      });
    }
    
    inputVideo(url:string):SafeResourceUrl{
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
      }

    editarTestimonio()
    {
        console.log("entra");
        let testimonio = {};
        let visible;
        let prioridad;
        if(this.estado === "Disponible")
            visible = 1;
        else
            visible = 0;

        let numPrioridad = 3;
        switch(this.prioridad)
        {
            case "Alta":
                numPrioridad = 1;
                break;
            case "Media":
                numPrioridad = 2;
                break;
            case "Baja":
            default: 
                numPrioridad = 3;
        }

        testimonio = {
            "titulo" : this.titulo,
            "video_url" : this.url,
            "visible" : visible,
            "prioridad": numPrioridad,
        }
        this.testimService.updateTestimony(testimonio, this.currentKey);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Testimonio modificado!',
            showConfirmButton: false,
            timer: 1500
          });
  }

    eliminarTestimonio()
    {
        this.testimService.deleteTestimony(this.currentKey);
        this.callDeleteNotification();
    }
    /**********************************************************
     * ********************************************************
     * 
     * 
     */
    //Aqui voy pasando lo que ocupo
    
    //nombre: any;
    priority: any;
    visibilidad:any;
    imageUrl: any;
  
    fileList: any[];
  
    testimonioSelectedId: string;
    testimonioSelectedImg: string;
    testimonioSelectedName: string
    Testimonio = [];
    //closeResult: string;
    selectedValue : any;
    imgUrlSave: any;
  
    checkVisibilidad : boolean;
    checkPrioridad : boolean;

    open(content, id: string, name: string) {
        this.testimonioSelectedId = id;
        this.testimonioSelectedName = name;
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          console.log(`Closed with: ${result}`);
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
    
    onSelect(selectedItem: any, img: string, key:string)
    {
        this.testimonioSelectedImg = selectedItem.imageUrl;
        document.getElementById("titulo").setAttribute('value', selectedItem.titulo);
        document.getElementById("url").innerHTML = selectedItem.video_url;
    
        var selectorVisibilidad = document.getElementById("visibilidadOptions");
        var optionVisibilidad = document.createElement("option");
        var optionVisibilidad2 = document.createElement("option");

        //optionVisibilidad.innerHTML = selectedItem.visible;
        if(selectedItem.visible === "Disponible")
        {
          optionVisibilidad.innerHTML = "Disponible"
          optionVisibilidad2.innerHTML = "Ocultar"
        }else{
          optionVisibilidad.innerHTML = "Ocultar"
          optionVisibilidad2.innerHTML = "Disponible"
        }
        optionVisibilidad.selected = true;
        selectorVisibilidad.appendChild(optionVisibilidad);
        selectorVisibilidad.appendChild(optionVisibilidad2);
    
        var selectorPrioridad = document.getElementById("prioridadOptions");
        var optionPrioridad1 = document.createElement("option");
        var optionPrioridad2 = document.createElement("option");
        var optionPrioridad3 = document.createElement("option");
    
        
    
        if(selectedItem.prioridad === "Alta")
        {
          optionPrioridad1.innerHTML = "Alta";
          optionPrioridad1.selected = true;
        
          optionPrioridad2.innerHTML = "Media"
          optionPrioridad3.innerHTML = "Baja"
          
        }else if(selectedItem.prioridad === "Media"){
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
        this.currentKey = key;
        this.url = selectedItem.video_url;
        this.titulo = selectedItem.titulo;
    }

    //NUEVO HEROES
    /******
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * esto es lo de heroes que no se ha modificado
     */

    
  contenido: any;
  fallecido: any; 
  //nombre: any;
  //prioridad: any;
  //visibilidad:any;
  //imageUrl: any;

  //fileList: any[];

  heroeSelectedId: string;
  heroeSelectedImg: string;
  heroeSelectedName: string
  Heroe = [];
  //closeResult: string;
  //selectedValue : any;
  //imgUrlSave: any;

  //checkVisibilidad : boolean;
  //checkPrioridad : boolean;
  checkFallecido : boolean;


  FundacionRef: AngularFireList<any>;
  heroeRef: AngularFireObject<any>;

  /*ngOnInit(): void {
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
  */



  // deleteHeroe(){
  //   this.heroeRef = this.db.object('heroes/' + this.heroeSelectedId);
  //   this.heroeRef.remove();
  //   this.callDeleteNotification();
  // }

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

  callDeleteNotification(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Testimonio ha sido eliminado exitosamente!',
      showConfirmButton: false,
      timer: 1500
    })
  }
  /*
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

    this.titulo = nombreValue;
    this.url =  contenidoValue;
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
  */
}