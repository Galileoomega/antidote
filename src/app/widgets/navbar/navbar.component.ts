import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  public readonly routes: {name: string, url: string}[] = [
    {name: 'Home', url: '/'},
    {name: 'Projects', url: '/projects'},
    {name: 'Skills', url: '/skills'},
    {name: 'Contact Us', url: '/contact'}
  ]

  public showNavigationMenu: boolean = false

  public currentUrl: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
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
    this.router.navigateByUrl(url);

    this.enableScroll();
  }

  disableScroll() {
    window.addEventListener('scroll', this.preventDefault, { passive: true });
    window.addEventListener('wheel', this.preventDefault, { passive: false });
    window.addEventListener('touchmove', this.preventDefault, { passive: false });
    window.addEventListener('keydown', this.preventKeydown, { passive: false });
  }

  enableScroll() {
    window.removeEventListener('scroll', this.preventDefault);
    window.removeEventListener('wheel', this.preventDefault);
    window.removeEventListener('touchmove', this.preventDefault);
    window.removeEventListener('keydown', this.preventKeydown);
  }

  private preventDefault(event: Event) {
    event.preventDefault();
  }

  private preventKeydown(event: KeyboardEvent) {
    // Disable arrow keys, space, page up/down
    if ([32, 37, 38, 39, 40, 33, 34, 35, 36].includes(event.keyCode)) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    // Clean up listeners when the component is destroyed
    this.enableScroll();
  }
}
