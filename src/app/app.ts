import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Sidebar} from './components/sidebar/sidebar';
import { OrderList } from './components/order-list/order-list';
import {MenuComponent} from './components/menu/menu';
import { History } from './components/history/history';
import { Bills } from './components/bills/bills';
import { Settings } from './components/settings/settings';
import { CommonModule } from '@angular/common';
import { Inventory } from './components/inventory/inventory';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [Sidebar,CommonModule,OrderList,MenuComponent,History,Bills,Inventory,Settings],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-POS');

  isMenuOpen:boolean =false;

  currentView: string = 'menu';

  toggleMenu():void {
    this.isMenuOpen =!this.isMenuOpen;
    console.log('Mobile Menu:',this.isMenuOpen);
  }

  setView(viewName:string){
    this.currentView =viewName;
    this.isMenuOpen =false;
  }
}
