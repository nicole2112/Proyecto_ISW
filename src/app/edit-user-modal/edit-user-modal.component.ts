import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "angular-bootstrap-md";
import { ModalService } from "../services/modal.service";

@Component({
    selector: 'user-edit-modal',
    templateUrl: './edit-user-modal.component.html',
    styleUrls: ['./edit-user-modal.component.css']
})

export class EditUserModalComponent implements OnInit{

    @ViewChild('editUserModal') editUserModal: ModalDirective;
    constructor(private modalService: ModalService){}

    ngOnInit(){
        this.modalService.setModal(this.editUserModal);
    }
}