import { Component } from "@angular/core";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
@Component ({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.component.css']
})

export class NavbarComponent {
    faFacebook = faFacebook;
    faInstragram = faInstagramSquare;
}