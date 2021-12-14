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
    testimonyList : any[] = [];
    fullList: any[];
    urlList : string[];

    constructor(private testimService: TestimonyService, private _sanitizer: DomSanitizer)
    {

    }

    ngOnInit(): void {
        this.testimService.getTestimonies().subscribe((item) => {
            this.fullList = item;
            this.fullList.forEach((item) =>
            {
                console.log(item);
                if(item.visible)
                    this.testimonyList.sort((a,b) => (a.prioridad > b.prioridad) ? 1 : ((b.prioridad > a.prioridad) ? -1 : 0));
                    this.testimonyList.push(item);
            });

        });

        

    }

    inputVideo(url:string):SafeResourceUrl{
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
      }

}