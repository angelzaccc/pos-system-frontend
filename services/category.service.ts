import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


// 🚀 Update this line with the missing '-fwpu' hash!
private apiUrl = 'https://pos-backend-fwpu.onrender.com/api';

  constructor(private http: HttpClient) { }

  // 🚀 2. Using normal quotes with '+' makes it 100% safe from template literal typos
  getAllMenuItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/menu-items');
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/categories');
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/menu-items/' + id);
  }

  addMenuItem(item: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('price', item.price.toString());
    formData.append('categoryId', item.categoryId.toString());
    formData.append('categoryName', item.categoryName);

    if (file) {
      formData.append('file', file, file.name);
    }

    return this.http.post(this.apiUrl + '/menu-items', formData);
  }

  updateMenuItem(id: number, item: any, file?: File): Observable<any> {
    console.log("Item being updated:", item);
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<any>(this.apiUrl + '/menu-items/' + id, formData);
  }
}