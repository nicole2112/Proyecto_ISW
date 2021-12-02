import { Component } from "@angular/core";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

@Component ({
    selector: 'footer-comp',
    templateUrl: './footer.component.html',
    styleUrls: ['footer.component.css']
})

export class FooterComponent {
    faFacebook = faFacebookF;
    faInstagram = faInstagram;
    faTwitter = faTwitter;
}