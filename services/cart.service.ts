import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  categoryName: string;
  imageUrl?: string;
  selectedCupSize: string;
  selectedIceLevel: number;
  selectedSugarLevel: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  cart$ = this.cartSubject.asObservable();
  
  // 🚀 Change this to match your Spring Boot PostMapping controller endpoint!
  // (e.g., if your Java backend uses @RequestMapping("/api/transactions") or "/api/orders")
  private apiUrl = 'https://pos-backend.onrender.com/api/transactions';

  constructor(private http: HttpClient) {}

  getCartSnapshot(): CartItem[] {
    return [...this.cartItems];
  }

  addToCart(item: any): void {
    const newItem: CartItem = {
      id: item.id,
      name: item.name,
      price: Number(item.price),
      categoryName: item.categoryName,
      imageUrl: item.imageUrl,
      selectedCupSize: item.selectedCupSize || 'S',
      selectedIceLevel: item.selectedIceLevel || 30,
      selectedSugarLevel: item.selectedSugarLevel || 30,
      quantity: item.quantity || 1
    };

    const existingIndex = this.cartItems.findIndex(c => 
      c.id === newItem.id &&
      c.selectedCupSize === newItem.selectedCupSize &&
      c.selectedIceLevel === newItem.selectedIceLevel &&
      c.selectedSugarLevel === newItem.selectedSugarLevel
    );

    if (existingIndex > -1) {
      this.cartItems[existingIndex].quantity += newItem.quantity;
    } else {
      this.cartItems.push(newItem);
    }

    this.cartSubject.next([...this.cartItems]);
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.cartSubject.next([...this.cartItems]);
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTaxAmount(): number {
    return this.getSubtotal() * 0.10; // 10% VAT
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.getTaxAmount();
  }

  getTotalItemsCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  saveTransaction(transactionData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, transactionData);
  }
}