import { Injectable } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';

@Injectable({

providedIn:'root',

})

export class ModalService {

editUserModal:ModalDirective;

constructor() { }

setModal(modal:ModalDirective) {

this.editUserModal=modal;

}

showModal() {

this.editUserModal.show();

}

}