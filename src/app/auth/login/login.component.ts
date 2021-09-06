import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { authService } from "../auth.service";

@Component({
  templateUrl:"./login.component.html",
  styleUrls:["./login.component.css"]
})

export class LoginComponent implements OnInit,OnDestroy {
  isLoading = false;
  private authStatus:Subscription = new Subscription;
  constructor(private authservice : authService){}
   ngOnInit(){
     this.authStatus = this.authservice.isUserAuth().subscribe(auth=>{
       this.isLoading = false;
     })
   }


  onLogin(formData:NgForm){
    if(formData.invalid){
      return;
    }
    this.isLoading = true;
   this.authservice.login(formData.value.email,formData.value.password);
    formData.reset();
  }
  ngOnDestroy(){
    this.authStatus.unsubscribe();
  }
}
