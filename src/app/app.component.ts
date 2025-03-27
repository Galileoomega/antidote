import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './widgets/navbar/navbar.component';
import { FooterBlurComponent } from './widgets/footer-blur/footer-blur.component';
import { CRouterService } from './common/services/c-router.service';
import { ScrollbarComponent } from './widgets/scrollbar/scrollbar.component';
import { DeviceDetectorService } from './common/services/device-detector.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent, FooterBlurComponent, ScrollbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'antidote';

  public showFader: boolean = false;
  public clientIsMobile: boolean = false;

  constructor(
    private crouter: CRouterService,
    private deviceDetector: DeviceDetectorService
  ) {
    crouter.loading$.subscribe((newState: boolean) => {
      setTimeout(() => {
        this.showFader = newState;
      }, 1);
    });

    deviceDetector.isMobile$.subscribe((isMobile: boolean) => {
      this.clientIsMobile = isMobile;
    });
  }
}
