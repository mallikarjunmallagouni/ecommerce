import { Component, OnInit } from '@angular/core';
import { SignUp, cart, login, product } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit{
  showLogin : boolean = true;
  authError : string = "";
  constructor(private user:UserService, private product:ProductService){}

  ngOnInit(): void {
   this.user.userAuthReload();
  }
  signUp(data:SignUp){
    console.warn(data);
    this.user.userSignUp(data)
  }
  login(data:login){
    console.warn(data);
    this.user.userLogin(data);
    this.user.invalidUserAuth.subscribe((result)=>{
      console.warn(result);
      if(result){
        this.authError = "User Not Found" 
      }else{
        this.localCartToRemoteCart()
      }
      
    })
  }

  openSignUp(){
    this.showLogin = false;
  }
  openLogin(){
    this.showLogin = true;
  }
  localCartToRemoteCart(){
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    console.warn(userId);
    
    if(data){
    let cartDataList:product[] = JSON.parse(data)
    cartDataList.forEach((product:product,index: number) => {
      let cartData : cart = {
        ...product,
        productId:product.id,
        userId
      };
      delete cartData.id;
      setTimeout(()=>{
        this.product.addToCart(cartData).subscribe((result)=>{
          if(result){
            console.warn("data is stored in DB");
          }
        })
      },500);
      if(cartDataList.length === index + 1){
        localStorage.removeItem('localCart')
      }
    });
    }
    setTimeout(()=>{
      this.product.getCartList(userId)
    },2000)
  }
}
