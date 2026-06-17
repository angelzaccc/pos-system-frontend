import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // 🚀 Your single base live backend link
  private apiUrl = 'https://pos-backend.onrender.com/api';

  constructor(private http: HttpClient) { }

  // Fetches menu items from: https://pos-backend.onrender.com/api/menu-items
  getAllMenuItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menu-items`);
  }

  // Fetches categories from: https://pos-backend.onrender.com/api/categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  // Deletes an item from: https://pos-backend.onrender.com/api/menu-items/{id}
  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/menu-items/${id}`);
  }

  // Sends new item form data safely to your live cloud server
  addMenuItem(item: any, file?: File): Observable<any> {
    const formData = new FormData();

    formData.append('name', item.name);
    formData.append('price', item.price.toString());
    formData.append('categoryId', item.categoryId.toString());
    formData.append('categoryName', item.categoryName);

    if (file) {
      formData.append('file', file, file.name);
    }

    // ✨ Fixed: Redirected away from localhost to your live production route
    return this.http.post(`${this.apiUrl}/menu-items`, formData);
  }

  // Updates an item via: https://pos-backend.onrender.com/api/menu-items/{id}
  updateMenuItem(id: number, item: any, file?: File): Observable<any> {
    console.log("Item being updated:", item);
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));
    
    if (file) {
      formData.append('file', file);
    }
    
    return this.http.put<any>(`${this.apiUrl}/menu-items/${id}`, formData);
  }
}