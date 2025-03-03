import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './widgets/navbar/navbar.component';
import { LoaderComponent } from './interface/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'antidote';

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    // event.preventDefault();
    // return false;
  }

  constructor() {}
}
