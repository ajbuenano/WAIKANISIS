import { Component, HostListener, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { navbarData } from './nav-data';
import { UsersService } from 'src/app/pages/services/users.service';
import { INavbarData } from '../models/navItem.interface';

interface SideNavToggle{
  screenWidth:number;
  collapsed:boolean;

}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = true;
  screenWidth = 0;
  navData = navbarData;
  filteredNavbarData!: INavbarData[];
  multiple: boolean = false;

  usersSvc = inject(UsersService);

  @HostListener('window:resize', ['$event'])
  onResize(event:any){
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768){
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth; 
    let role:string = this.usersSvc.getUserRole()!;
    this.filteredNavbarData = navbarData.filter(item => item.permisos!.includes(role));
  }

  toggleCollapse(): void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  handleClick(item: INavbarData):void{
    if (!this.multiple) {
      for (let modelItem of this.filteredNavbarData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }
}
