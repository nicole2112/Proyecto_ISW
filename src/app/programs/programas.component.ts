import { Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer} from '@angular/platform-browser';
import { ContactUsComponent } from "../contact-us/contact-us.component";
import { AuthenticationService } from "../services/auth.services";
@Component({
    selector: 'programas',
    templateUrl: './programas.component.html',
    styleUrls: ['programas.component.css']
})




export class ProgramasComponent implements OnInit{
    archivo:any;
    pdfList: any;

    constructor(private service: AuthenticationService){}

    ngOnInit(){
        this.service.db.list('PDF-Programas').valueChanges().subscribe(
            pdf =>{
                this.pdfList = pdf;
                console.log(this.pdfList);
            }
        )
    }


}