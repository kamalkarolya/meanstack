import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthData } from "../auth.model";
import { authService } from "../auth.service";

@Component({
  templateUrl:"./signup.component.html",
  styleUrls:["./signup.component.css"]
})

export class SignupComponent implements OnInit , OnDestroy  {
 isLoading = false;
 private authStatus :Subscription = new Subscription;
 constructor(private authservice:authService){}
 ngOnInit(){
   this.authStatus =   this.authservice.isUserAuth().subscribe(auth=>{
     this.isLoading = false;
   });
}
 onSignup(form:NgForm){
   if(form.invalid || form.value.password!=form.value.cpassword){
     return;
    }
   this.isLoading = true;
   const user : AuthData = {
     fname : form.value.fname,
     phone  : form.value.phone,
     occupation : form.value.occupation,
     email : form.value.email,
     password : form.value.password,
    }
    this.authservice.newUser(user);
  //  form.reset();
  }
  ngOnDestroy(){
    this.authStatus.unsubscribe();
  }
}
