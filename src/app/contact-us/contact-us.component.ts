import { Component } from "@angular/core";
import { ContactUsForm } from "../contact-us-form/contactUsForm";

@Component({
    selector: 'contact-us-form',
    templateUrl: './contact-us.component.html',
    styleUrls: ['contact-us.component.css']
})

export class ContactUsComponent{
    //form = new ContactUsForm('','','','');
    submitted = false;
    onSubmit() { this.submitted = true; }
}