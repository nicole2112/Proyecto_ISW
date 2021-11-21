import { Component } from "@angular/core";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";

@Component ({
    selector: 'footer-comp',
    templateUrl: './footer.component.html',
    styleUrls: ['footer.component.css']
})

export class FooterComponent {
    faFacebook = faFacebook;
    faInstragram = faInstagramSquare;
}