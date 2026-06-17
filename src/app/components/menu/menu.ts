import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesComponent } from '../categories/categories.components';

@Component({
  selector: 'app-menu',
  standalone: true,

  imports: [CommonModule, CategoriesComponent], 
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {
  
  constructor() { }
  ngOnInit(): void { }
}