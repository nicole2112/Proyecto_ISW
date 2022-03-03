
import { Component } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { BlogService } from "../services/blog.service";
import * as _ from "lodash";

@Component({
    selector: 'blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css']
})

export class BlogComponent{

    constructor(private blogService: BlogService, private _sanitizer: DomSanitizer)
    {

    }

    blogList: any[];
    filteredBlogList: any[];
    categoryList: any[];
    filteredCategories: any[];

    filters = {};

    ngOnInit(): void {
        this.blogService.getArticulos().subscribe((item) => {
            this.blogList = item.sort((a, b) => {
                let dateA = new Date(b.fechaCreacion), dateB = new Date(a.fechaCreacion)
                return +dateA - +dateB;
            });
           // console.log(new Date);
            this.filteredBlogList = this.blogList;
        });


        this.blogService.getCategorias().subscribe(categories => {
            this.categoryList = categories;
        });
    }

    getCategorias(blog){
        let tmpArray = [];
        for (let cat in blog.categorias){
            // console.log(cat, blog.categorias);
            tmpArray.push(blog.categorias[cat]);
        }

        return tmpArray;
    }

    applyCategoryFilter(category) {
        if (category === "all") {
            this.filteredBlogList = this.blogList;
        } else {
            this.filteredBlogList = this.blogList.filter(blog => {
                return Object.keys(blog.categorias).find((value, index) => {
                    return blog.categorias[value] == category;
                });
            });
        }
    }

}