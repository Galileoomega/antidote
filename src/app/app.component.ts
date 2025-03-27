import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceDetectorService } from './core/services/device-detector.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterBlurComponent } from './shared/components/footer-blur/footer-blur.component';
import { ScrollbarComponent } from './shared/components/scrollbar/scrollbar.component';
import { NavigationFaderComponent } from './shared/components/navigation-fader/navigation-fader.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    NavbarComponent,
    FooterBlurComponent,
    ScrollbarComponent,
    NavigationFaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'antidote-ssr';

  public clientIsMobile: boolean = false;

  constructor(
    private deviceDetector: DeviceDetectorService
  ) {
    deviceDetector.isMobile$.subscribe((isMobile: boolean) => {
      console.log(isMobile)
      this.clientIsMobile = isMobile;
    });
  }
}
