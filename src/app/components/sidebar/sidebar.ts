import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() activeView:string = 'menu';

  @Output() viewChange = new EventEmitter<string>();

  navigateTo(viewName:string){
    this.viewChange.emit(viewName);
  }
}
