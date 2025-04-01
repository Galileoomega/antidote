import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink} from '@angular/router';
import { CRouterService } from '../../../core/services/c-router.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  public readonly ROUTES: {name: string, url: string}[] = [
    {name: 'Home', url: '/'},
    {name: 'Projects', url: '/projects'},
    {name: 'Contact Us', url: '/contact'}
  ];

  public currentUrl: string = '';
  public showNavigationMenu: boolean = false
  private scrollActive: boolean = true;

  constructor(private router: Router, private crouter: CRouterService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  public navigateTo(url: string) {
    this.crouter.navigateTo(url)
  }

  public manageNavigationMenu(): void {
    if(this.showNavigationMenu) {
      this.showNavigationMenu = false;

      this.enableScroll();
    }
    else {
      this.showNavigationMenu = true;

      this.disableScroll();
    }
  }

  public navigate(url: string) {
    this.showNavigationMenu = false;

    this.crouter.navigateTo(url);

    this.enableScroll();
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:wheel', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  @HostListener('window:keydown', ['$event'])
  onResize(event: Event): void {
    if(this.scrollActive == false) {
      event.preventDefault();
    }
  }

  disableScroll() {
    this.scrollActive = false;
  }

  enableScroll() {
    this.scrollActive = true;
  }
}
