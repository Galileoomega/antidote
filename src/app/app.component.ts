import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './widgets/navbar/navbar.component';
import { FooterBlurComponent } from './widgets/footer-blur/footer-blur.component';
import { CRouterService } from './common/services/c-router.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent, FooterBlurComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'antidote';

  showFader: boolean = false;

  constructor(private crouter: CRouterService) {
    crouter.loading$.subscribe((newState: boolean) => {
      setTimeout(() => {
        this.showFader = newState;
      }, 1);
    });
  }
}
