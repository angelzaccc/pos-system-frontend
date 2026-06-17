import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from '../../../models/menu-item.model';
import { CategoryService } from '../../../../services/category.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
  standalone: true,
})
export class Inventory implements OnInit {
  inventoryItems: MenuItem[] = [];
  categories: any[] = [];

  selectedItem: any = null; 
  isModalOpen: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private categoryService: CategoryService, 
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    console.log('Inventory ngOnInit');
    this.loadInventoryData();

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories:', data);
        this.categories = data;
      }
    }); 
  }

  loadInventoryData(): void {
    this.categoryService.getAllMenuItems().subscribe({
      next: (data) => {
        console.log('Database Data:', data);
        console.log('First Item:', data[0]);

        this.inventoryItems = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to pull Postgres records for inventory:', err);
      }
    });
  }

  private assignCategoryName(): void {
    if (this.selectedItem && this.selectedItem.categoryId && this.categories.length > 0) {
      const matchedCategory = this.categories.find(cat => cat.id == this.selectedItem.categoryId);
      if (matchedCategory) {
        this.selectedItem.categoryName = matchedCategory.name;
      }
    }
  }

  onUpdate(item: any): void {

    this.selectedItem = { ...item };
    

    if (!this.selectedItem.categoryId && this.selectedItem.category_id) {
      this.selectedItem.categoryId = this.selectedItem.category_id;
    }
    
    this.assignCategoryName();
    
    this.isModalOpen = true;
  }

  onOpenAddModal(): void {
    const defaultCategoryId = this.categories.length > 0 ? this.categories[0].id : '';
    const defaultCategoryName = this.categories.length > 0 ? this.categories[0].name : '';

    this.selectedItem = {
      id: undefined,
      name: '',
      price: 0,
      categoryId: defaultCategoryId, 
      categoryName: defaultCategoryName,
      imageUrl: 'assets/icons/default.png'
    };
    
    this.isModalOpen = true;
  }

  onSaveChanges(): void {
    if (!this.selectedItem.name || this.selectedItem.price <= 0) {
      alert('Please fill out all product details correctly.');
      return;
    }


    this.assignCategoryName();

    const fileToUpload = this.selectedFile || undefined; 

    if (this.selectedItem.id) {
      this.categoryService.updateMenuItem(this.selectedItem.id, this.selectedItem, fileToUpload).subscribe({
        next: (response) => {
          alert('Product details updated successfully!');
          this.loadInventoryData(); 
          this.closeModal();
        },
        error: (err) => {
          console.error('Update operation failed:', err);
          alert('Error updating item. Ensure backend server connection is live.');
        }
      });
    } 
    else {
      this.categoryService.addMenuItem(this.selectedItem, fileToUpload).subscribe({
        next: (response) => {
          alert('New product added successfully!');
          this.loadInventoryData();
          this.closeModal();
        },
        error: (err) => {
          console.log('Status:', err.status);
          console.log('Error Body:', err.error);
          console.log(err);
        }
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  onDelete(item: any): void {
    if (!item || !item.id) return;

    const confirmDelete = confirm(`Are you sure you want to delete "${item.name}"?`);
    
    if (confirmDelete) {
      this.categoryService.deleteMenuItem(item.id).subscribe({
        next: () => {
          this.inventoryItems = this.inventoryItems.filter(i => i.id !== item.id);
          this.cdr.detectChanges();
          alert('Product successfully removed.');
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; 
      console.log('File reference captured:', this.selectedFile.name);

      if (this.selectedItem) {
        this.selectedItem.imageUrl = `assets/icons/${this.selectedFile.name}`;
        this.cdr.detectChanges();
      }
    }
  }
}