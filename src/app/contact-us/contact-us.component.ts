import { Component, OnInit } from "@angular/core";
import { ContactUsForm } from "../contact-us-form/contactUsForm";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: 'contact-us-form',
    templateUrl: './contact-us.component.html', 
    styleUrls: ['contact-us.component.css']
})

export class ContactUsComponent {
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    form = new FormGroup({
        name: new FormControl('', Validators.required),
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

    onSubmit(): void{
        console.table(this.form.value);
        console.log("Form is touched: ", this.form.touched);
        console.log("Is form valid: ", this.form.valid);
        console.log("Form dirty: ", this.form.dirty);
    }
}

// export class ContactUsComponent{
//     //form = new ContactUsForm('','','','');
//     submitted = false;
//     onSubmit() { this.submitted = true; }
// }