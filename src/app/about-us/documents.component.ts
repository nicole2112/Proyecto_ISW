import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/auth.services";

@Component({
    selector: 'documents-page',
    templateUrl: './documents.component.html', 
    styleUrls: ['documents.component.css']
})

export class DocumentsComponent {

    archivo:any;
    pdfList: any;
    openAccordion = [];

    constructor(private service: AuthenticationService){}

    ngOnInit(){
        this.service.db.list('PDF-Descargables').valueChanges().subscribe(
            pdf =>{
                this.pdfList = pdf;
                this.pdfList.sort((a,b) => (new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime())); 
                //console.log(this.pdfList);
            }
        )
    }

    

}
