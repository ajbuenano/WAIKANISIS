import { Component, Input, OnInit } from '@angular/core';

interface SideNavToggle{
  screenWidth:number;
  collapsed:boolean;

}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  isSideNavCollapsed = false;
  screenWidth = 0;

  ngOnInit(): void {
    this.isSideNavCollapsed = true;
    this.screenWidth = window.innerWidth;
  }
  
  onToggleSideNav(data: SideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getBodyClass():string{
    let styleClass = '';
    if(this.isSideNavCollapsed && this.screenWidth > 768){
      styleClass='body-trimmed';
    }
    else if(this.isSideNavCollapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass='body-md-screen';
    }
    return styleClass;
  }
}
