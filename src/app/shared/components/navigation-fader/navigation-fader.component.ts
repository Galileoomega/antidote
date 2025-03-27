import { Component } from '@angular/core';
import { CRouterService } from '../../../core/services/c-router.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-fader',
  imports: [
    CommonModule
  ],
  templateUrl: './navigation-fader.component.html',
  styleUrl: './navigation-fader.component.scss'
})
export class NavigationFaderComponent {

  public showFader: boolean = false;

  constructor(private crouter: CRouterService) {
    crouter.loading$.subscribe((newState: boolean) => {
      this.showFader = newState;
    });
  }
}
