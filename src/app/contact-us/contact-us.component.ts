import { Component, OnInit } from "@angular/core";
import { ContactUsForm } from "../contact-us-form/contactUsForm";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import '../../assets/js/smtp.js';
declare const Email: any;

@Component({
    selector: 'contact-us-form',
    templateUrl: './contact-us.component.html', 
    styleUrls: ['contact-us.component.css']
})

export class ContactUsComponent {
    namePattern = "^[a-zA-Z ]*$";
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

    alert:boolean = false;

    form = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.pattern(this.namePattern)
        ]),
        correo: new FormControl('', [
            Validators.required,
            Validators.pattern(this.emailPattern)
        ]),
        asunto: new FormControl(),
        mensaje: new FormControl()
    });
    get name(): any{
        return this.form.get('name');
    }

    get correo() {
        return this.form.get('correo');
    }

    get asunto() {
        return this.form.get('asunto');
    }

    get mensaje() {
        return this.form.get('mensaje');
    }

    onSubmit(): void{
        Email.send({
            SecureToken: "c4c2a6e5-ad26-49e5-8f8d-4468439ac72c",
            To: 'aaron20092009@hotmail.com',
            From: 'lopez.aaron1022@gmail.com',
            Subject: `Consulta - ${this.asunto.value}`,
            Body: `${this.name.value}` + ` -${this.correo.value}- `+ '\n' + `${this.mensaje.value}`
          }).then(
            message => console.log(message)
          );
          this.alert = true;
          this.form.reset();
    }

    closeAlert() {
        this.alert = false;
    }
}

// export class ContactUsComponent{
//     //form = new ContactUsForm('','','','');
//     submitted = false;
//     onSubmit() { this.submitted = true; }
// }