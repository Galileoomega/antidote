import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './widgets/navbar/navbar.component';
import { LoaderComponent } from './interface/loader/loader.component';
import { ScrollPositionService } from './common/services/scroll-position.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'antidote';

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    return false;
  }

  constructor(
    private router: Router,
    private scrollPositionService: ScrollPositionService
  ) {
    // Set to false to enable scroll-to-top behavior
    this.scrollPositionService.setPreserveScroll(true);
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     window.scrollTo(0, 0);
    //   }
    // });

    // setTimeout(() => {
    //   window.scrollTo(0, 0);
    // }, 200);
  }
}
