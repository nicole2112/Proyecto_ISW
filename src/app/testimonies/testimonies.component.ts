import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml, SafeResourceUrl } from "@angular/platform-browser";
import { TestimonyService } from "../services/testimony.service";

@Component({
    selector: 'testimonies',
    templateUrl: './testimonies.component.html',
    styleUrls: ['testimonies.component.css']
})

export class TestimoniesComponent implements OnInit
{
    testimonyList : any[];
    urlList : string[];

    constructor(private testimService: TestimonyService, private _sanitizer: DomSanitizer)
    {

    }

    ngOnInit(): void {
        //console.log(this.testimService.getTestimonies());
        this.testimService.getTestimonies().subscribe((item) => {
            //console.log(item);
            // let nuevo = item;
            // nuevo.forEach(element => {
            //     element.video_url = this.inputVideo(element.video_url);
            // });
            this.testimonyList = item;
            console.log(this.testimonyList);

        });

    }

    inputVideo(url:string):SafeResourceUrl{
        console.log(this._sanitizer.bypassSecurityTrustResourceUrl(url));
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
      }

}