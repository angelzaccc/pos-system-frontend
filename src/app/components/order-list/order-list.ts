import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface TransactionItem {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  selectedCupSize: string;
  selectedIceLevel: number;
  selectedSugarLevel: number;
}

export interface TransactionLog {
  id: number;
  transactionId: string;
  customerName: string;
  paymentMethod: string;
  subtotal: number;
  vatTax: number;
  grandTotal: number;
  createdAt: string;
  cartItems: TransactionItem[];
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit {
  transactionLogs: TransactionLog[] = [];
  private backendUrl = 'http://localhost:8080/api/transactions'; 

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef ) {}
  

  ngOnInit(): void {
    this.loadTransactionLogs();
  }

  loadTransactionLogs(): void {
    this.http.get<TransactionLog[]>(this.backendUrl).subscribe({
      next: (data) => {
        
        this.transactionLogs = data.sort((a, b) => b.id - a.id);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load transaction records from database:', err);
      }
    });
  }
}


