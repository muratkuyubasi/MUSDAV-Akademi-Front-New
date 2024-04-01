import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss','../dashboard.component.scss']
})
export class CartComponent {
  
  public courses:any[]=[]
  
  constructor(
    public cartService:CartService
  ){
    this.cartService.cartItems.subscribe(resp=>{
      this.courses = resp
    })
  }

  public get getTotal(): Observable<number> {
    return this.cartService.cartTotalAmount();
  }

  // Increament
  increment(course, qty = 1) {
    this.cartService.updateCartQuantity(course, qty);
  }

  // Decrement
  decrement(course, qty = -1) {
    this.cartService.updateCartQuantity(course, qty);
  }

  removeCourse(course){
    this.cartService.removeCartItem(course);
  }
}
