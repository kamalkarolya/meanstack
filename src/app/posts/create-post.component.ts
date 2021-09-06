import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { Posts } from "./posts.model";
import { mimeType} from "./mimi.type.validator";
import { PostService } from "./posts.service";
import { authService } from "../auth/auth.service";

@Component({
  selector: 'app-post-component',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})

export class PostCreateComponent implements OnInit,OnDestroy {
  //  @Output() createdPost = new EventEmitter<Posts>();
  enteredtitle = '';
  enteredcontent = '';
  isLoading=false;
  post!:Posts;
  form!:FormGroup;
  imagePreview!:string;
  private postId!: string ;
  private mode = 'create';
  private authStatus : Subscription = new Subscription;
// ,asyncValidators:[mimeType]
  constructor(public postsService: PostService, public route: ActivatedRoute,private authservice:authService) { }
  ngOnInit() {
   this.authStatus =  this.authservice.isUserAuth().subscribe(()=>{
      this.isLoading = false
    })
     this.form = new FormGroup({
       title: new FormControl(null , {validators:[Validators.required, Validators.minLength(3)] } ),
       content: new FormControl(null , {validators:[Validators.required, Validators.minLength(3)] } ),
       image: new FormControl(null , {validators:[Validators.required] })
     });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') as string;
        this.isLoading=true;
        this.postsService.getOnePost(this.postId)
        .subscribe(postData=>{
          this.isLoading=false;
             this.post ={id:postData._id,
              title:postData.title,
              content:postData.content,
              imagePath:postData.imagePath,
              creator : postData.creator
            }
             this.form.setValue({
               title :this.post.title,
               content:this.post.content,
               image:this.post.imagePath
             });
          });
      } else {
        this.mode = 'create';
        this.postId = 'null';
      }
    })
  }
  AddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading=true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title,
        this.form.value.content,
        this.form.value.image);

    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content,this.form.value.image);
    }
    // alert("Post Added !!!");
    //console.dir(postInput);

    // const post:Posts = {
    //   title:form.value.title ,
    // content:form.value.content };
    // this.createdPost.emit(post);
    this.form.reset();
  }
  onImagePick(event:Event){
    const inputFile = event.target as HTMLInputElement ;
    if(!inputFile.files?.length){
      return;
    }
    const file = inputFile.files[0];
     this.form.patchValue({image:file});
     this.form.get('image')?.updateValueAndValidity();
     console.log(file);
     console.log(this.form);
    const imageReader = new FileReader();
    imageReader.onload=()=>{
       this.imagePreview = imageReader.result as string;
    };
    imageReader.readAsDataURL(file);

  }
  ngOnDestroy(){
    this.authStatus.unsubscribe();
  }

}
