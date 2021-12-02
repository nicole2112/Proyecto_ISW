import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '../models/user';
import { ModalService } from '../services/modal.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getAuth } from '@firebase/auth';
@Component({
  selector: 'app-portal-admin',
  templateUrl: './portal-admin.component.html',
  styleUrls: ['./portal-admin.component.css']
})

export class PortalAdminComponent implements OnInit {
  roleOptions = '';
  selectedValue : any;
  closeResult: string;
  User = [];
  userSelectedId : string;

  constructor(public auth: AngularFireAuth, private db:AngularFireDatabase, private modalService: NgbModal, private _sanitizer: DomSanitizer) { }
  ShowUsers = false;

  toggleUsersHandler(isShow: boolean){
    this.ShowUsers = true;
    console.log(this.ShowUsers);
  }

  FundacionRef: AngularFireList<any>;
  userRef: AngularFireObject<any>;

  ngOnInit(): void {
    this.FundacionRef = this.db.list('usuarios');

    this.FundacionRef.snapshotChanges().subscribe(data =>{
      this.User = [];
      data.forEach(user => {
        let a = user.payload.toJSON();
        a['$key'] = user.key;
        this.User.push(a as User);
      })
      console.table(this.User);
    })
  }

  private _inputEmail: string;
  private _inputRole: string;
  private _inputId: string;

  public get inputEmail(): SafeHtml{
    return this._sanitizer.bypassSecurityTrustHtml(this._inputEmail);
  }

  public get inputRole(): SafeHtml{
    return this._sanitizer.bypassSecurityTrustHtml(this._inputRole);
  }

  public get inputId(): SafeHtml{
    return this._sanitizer.bypassSecurityTrustHtml(this._inputId);
  }

  onSelect(selectedItem: any){

    document.getElementById("correo").setAttribute('value', selectedItem.email);
    var selector = document.getElementById("roleOptions");
    var option = document.createElement("option");
    if(selectedItem.rol != '')
    {
      selectedItem.rol == "Admin" ? option.innerText = 'Digitador' : option.innerText = 'Administrador'
      selector.appendChild(option);
    }else{
      for(let i = 0; i < 2; i++){
        var opt = document.createElement("option");
        i === 0 ? opt.innerText = 'Administrador' : opt.innerText = 'Digitador'
        selector.appendChild(opt);
      }
    }
    
  }

  open(content, id: string) {
    this.userSelectedId = id;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  onChange(event : any){
    var selector = document.getElementById('roleOptions') as HTMLSelectElement;
    this.selectedValue = selector.options[selector.selectedIndex].text;

    let errorLabel = document.getElementById('error-label') as HTMLLabelElement;
    let submitButton = document.getElementById('saveBtn') as HTMLButtonElement;

    if(this.selectedValue === 'Seleccion de Rol'){
      errorLabel.innerText = '*Seleccione una opcion valida*';
      submitButton.disabled = true;
    }else{
      errorLabel.innerText = '';
      submitButton.disabled = false;
    }
  }

  deleteUserScript: HTMLScriptElement;

  deleteUser(){
    this.userRef = this.db.object('usuarios/' + this.userSelectedId);
    this.userRef.remove();
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
}

