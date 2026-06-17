import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CategoryService } from '../../../../services/category.service';
import { CartService, CartItem } from '../../../../services/cart.service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  allItems: any[] = [];
  filteredItems: any[] = [];
  categories: Category[] = [];
  selectedCategory: string = 'All Menu';

  // 🌟 Reactive Cart Variables
  cart: CartItem[] = [];
  customerName: string = '';
  paymentMethod: string = 'Cash';
  currentTransactionId: string = '';
  currentDateTimeString: string = '';

  constructor(
    private categoryService: CategoryService, 
    public cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.generateNewTransactionId();
    this.loadCategories();
    
  
    this.cartService.cart$.subscribe(items => {
      this.cart = items;
      this.cdr.detectChanges();
    });
    
    this.categoryService.getAllMenuItems().subscribe(data => {
      this.allItems = data.map(item => ({ 
        ...item, 
        quantity: 1,
        selectedCupSize: 'S',
        selectedIceLevel: 30,
        selectedSugarLevel: 30
      }));
      this.filteredItems = this.allItems;
      this.cdr.detectChanges();
    });
  }

  generateNewTransactionId(): void {
    this.currentTransactionId = Math.floor(100000 + Math.random() * 900000).toString();
  }


  increaseQuantity(item: any): void {
    item.quantity = (item.quantity || 1) + 1;
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  selectCupSize(item: any, size: string): void { item.selectedCupSize = size; }
  selectIceLevel(item: any, level: any): void { item.selectedIceLevel = Number(level); }
  selectSugarLevel(item: any, level: any): void { item.selectedSugarLevel = Number(level); }


  addItemToCart(item: any): void {
    this.cartService.addToCart(item);
    

    item.quantity = 1;
    item.selectedCupSize = 'S';
    item.selectedIceLevel = 30;
    item.selectedSugarLevel = 30;
  }

  removeItemFromCart(index: number): void {
    this.cartService.removeFromCart(index);
  }


  processTransaction(): void {
    if (this.cart.length === 0) return;

    this.currentDateTimeString = new Date().toLocaleString('en-PH');


    const transactionPayload = {
      transactionId: this.currentTransactionId,
      customerName: this.customerName.trim() || 'Walk-In Customer',
      paymentMethod: this.paymentMethod,
      subtotal: this.cartService.getSubtotal(),
      

      vatTax: this.cartService.getTaxAmount(),
      
   
      grandTotal: this.cartService.getGrandTotal(),
      
      cartItems: this.cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedCupSize: item.selectedCupSize,
        selectedIceLevel: item.selectedIceLevel,
        selectedSugarLevel: item.selectedSugarLevel
      }))
    };


    this.cartService.saveTransaction(transactionPayload).subscribe({
      next: (response) => {
        alert(`Transaction #${this.currentTransactionId} saved securely to Database!`);
        

        setTimeout(() => {
          window.print();
          this.clearActiveCartSession();
        }, 300);
      },
      error: (err: any) => { 
        console.error('Database write error occurred:', err);
        alert('Failed to sync order with database, but printing fallback receipt...');
        window.print();
      }
    });
  }

  clearActiveCartSession(): void {
    this.cartService.clearCart();
    this.customerName = '';
    this.paymentMethod = 'Cash';
    this.generateNewTransactionId();
    this.cdr.detectChanges();
  }

  selectCategory(name: string): void {
    this.selectedCategory = name;
    if (name === 'All Menu') {
      this.filteredItems = this.allItems;
    } else {
      this.filteredItems = this.allItems.filter(item => item.categoryName === name);
    }
    this.cdr.detectChanges();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }
}