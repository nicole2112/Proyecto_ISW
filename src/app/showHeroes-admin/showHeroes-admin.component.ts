import { Component, OnInit } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Heroe } from '../models/heroe';

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

  fileList: any[];

  heroeSelectedId: string;
  Heroe = [];
  closeResult: string;
  selectedValue : any;


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
        console.table(this.Heroe);
        })
  }

  open(content, id: string) {
    this.heroeSelectedId = id;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSelect(selectedItem: any){

    document.getElementById("nombre").setAttribute('value', selectedItem.nombre);
    var selector = document.getElementById("visibilidadOptions");
    var option = document.createElement("option");
    if(selectedItem.visibilidad != '')
    {
      selectedItem.visibilidad == "publico" ? option.innerText = 'privado' : option.innerText = 'publico'
      selector.appendChild(option);
    }else{
      for(let i = 0; i < 2; i++){
        var opt = document.createElement("option");
        i === 0 ? opt.innerText = 'publico' : opt.innerText = 'privado'
        selector.appendChild(opt);
      }
    }
    
  }

  checkOption(){
    var selector = document.getElementById('visibilidadOptions') as HTMLSelectElement;
    var selectorValue = selector.options[selector.selectedIndex].text;
    let submitButton = document.getElementById('saveBtn') as HTMLButtonElement;
    if(selectorValue ==='Visibilidad'){
      submitButton.disabled = true;
    }else{
      submitButton.disabled = false;
    }
  }

  onChange(event : any){
    var selector = document.getElementById('visibilidadOptions') as HTMLSelectElement;
    this.selectedValue = selector.options[selector.selectedIndex].text;

    let errorLabel = document.getElementById('error-label') as HTMLLabelElement;
    let submitButton = document.getElementById('saveBtn') as HTMLButtonElement;

    if(this.selectedValue === 'Visibilidad'){
      errorLabel.innerText = '*Seleccione una opcion valida*';
      submitButton.disabled = true;
    }else{
      errorLabel.innerText = '';
      submitButton.disabled = false;
    }
  }

  updateHeroe(){
    var selector = document.getElementById('visibilidadOptions') as HTMLSelectElement;
    var selectorValue = selector.options[selector.selectedIndex].text;

    const heroeRef = this.db.object('heroes/' + this.heroeSelectedId);
    var updateValue = '';
    updateValue = "updateUser";

    heroeRef.update({
      rol: updateValue
    })
  }

  deleteHeroe(){
    this.heroeRef = this.db.object('usuarios/' + this.heroeSelectedId);
    this.heroeRef.remove();
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

      this.onChangeFile(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
  }

  // From attachment link
  onChangeFile(event) {
    this.onFileChange(event.target.files);    // "target" is correct here
    }

    private onFileChange(files: File[]) {
        this.fileList = files;
        console.log(files[0].name);
      }
}