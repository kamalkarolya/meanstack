import { Injectable } from "@angular/core";
import { Posts } from "./posts.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
const BACKEND_URL = environment.apiUrl + "posts";
@Injectable({ providedIn: "root" })

export class PostService {
  private posts: Posts[] = [];
  private postUpdated = new Subject<{posts:Posts[],postCount:number}>();
  constructor(private http: HttpClient, private router: Router) { }
  getPost(postPerpage: number, cPage: number) {
    const Urlquery = `?pagesize=${postPerpage}&page=${cPage}`
    this.http.get<{ messege: string, posts: any, postCount: number }>(BACKEND_URL + Urlquery)
      .pipe(
        map(postData => {
        return {posts:postData.posts.map((post: {title: string;content: string;_id: string;imagePath: string,creator:string}) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator : post.creator
          };
        }),
        count:postData.postCount
      };
      })
      )
      .subscribe(transformedData => {


        this.posts = transformedData.posts;
        this.postUpdated.next({
           posts:[...this.posts],
           postCount: transformedData.count});
      });

  }

  getPostUpdated() {
    return this.postUpdated.asObservable();
  }
  getOnePost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
       content: string,
        imagePath: string,
        creator:string
      }>(BACKEND_URL+'/' + id);
  }
  addPost(title: string, content: string, image: File) {
    // const post: Posts = { id: "null", title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ messege: string, post: Posts }>(BACKEND_URL, postData)
      .subscribe(responseData => {

        this.router.navigate(["/"]);
      });
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Posts = { id:id, title:title, content:content,imagePath:"null" };
    let postData: Posts | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator:"null"
      };

    }
    this.http.put(BACKEND_URL+'/' + id, postData)
      .subscribe(response => {

        this.router.navigate(["/"]);
      });
  }
  deletePost(postid: string) {
   return this.http.delete(BACKEND_URL+'/' + postid);

  }

}
