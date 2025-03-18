import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ScrollbarComponent } from '../../widgets/scrollbar/scrollbar.component';
import { ScramblerTextComponent } from '../../widgets/scrambler-text/scrambler-text.component';
import { RouterLink } from '@angular/router';
import { StarExposureComponent } from '../../widgets/star-exposure/star-exposure.component';
import { PlanetGenComponent } from '../../widgets/planet-gen/planet-gen.component';
import { AutoScrollService } from '../../common/services/auto-scroll.service';
import { StarRainComponent } from '../../widgets/star-rain/star-rain.component';
import { ProjectsPreviewComponent } from '../../widgets/projects-preview/projects-preview.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, 
    ScrollbarComponent, 
    ScramblerTextComponent, 
    StarExposureComponent, 
    RouterLink, 
    PlanetGenComponent, 
    StarRainComponent,
    ProjectsPreviewComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Store the current coordinates of the mouse.
  private mouseX: number = 0;
  private mouseY: number = 0;

  // Store the current scroll position.
  public scrollPosition: number = 0;

  // Screen dimmensions.
  public screenWidth: number = window.innerWidth;
  public screenHeight: number = window.innerHeight;

  // The offset amount from the center of the screen (in pixel).
  private mouseOffsetX!: number;
  private mouseOffsetY!: number;

  public currentPageIndex: number = 0;

  constructor(
    private autoScroll: AutoScrollService
  ) {}

  private getPageIndexFromScroll(): number {
    const percentage: number = ((this.scrollPosition - this.screenHeight * Math.floor(this.scrollPosition / this.screenHeight)) / this.screenHeight) * 100;

    // Calculate the pageIndex by dividing scrollPosition by screenHeight and rounding down
    let pageIndex = Math.floor(this.scrollPosition / this.screenHeight);

    // If the percentage is greater than 0, we consider being on the next page, so increment the pageIndex
    if (percentage > 0) {
      pageIndex += 1;
    }

    return pageIndex;
  }
  
  private calculateMouseOffsetFromCenter(): void {
    // Get the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate the mouse offset from the center
    const mouseOffsetX = this.mouseX - centerX;
    const mouseOffsetY = this.mouseY - centerY;

    // Calculate the percentage of the offset relative to the screen dimensions
    this.mouseOffsetX = (mouseOffsetX / centerX) * 100
    this.mouseOffsetY = (mouseOffsetY / centerY) * 100
  }

  public moveByMouseOffset(bodyId: string, speedFactor: number): { [key: string]: string } {
    // Define base values for calculations
    const offsetX = this.mouseOffsetX / 2 * speedFactor;
    const offsetY = this.mouseOffsetY / 2 * speedFactor;
  
    // Create a default return object
    const styles: { [key: string]: string } = {};
  
    // Handle different bodyId cases
    switch (bodyId) {
      case "planet-1":
        styles['left'] = `calc(50% + ${offsetX}px)`;
        styles['top'] = `calc(50% + ${offsetY}px)`;
        break;
  
      case "sat-1":
        styles['left'] = `calc(10vw + ${offsetX}px)`;
        styles['bottom'] = `calc(10vh + ${-offsetY}px)`; // Notice the inverted offsetY
        break;
  
      case "sat-2":
        styles['right'] = `calc(10vw + ${offsetX}px)`;
        styles['top'] = `calc(10vh + ${-offsetY}px)`; // Notice the inverted offsetY
        break;
  
      default:
        // No change to styles, return empty object
        return styles;
    }
  
    // Return the computed styles
    return styles;
  }  

  public fixToPage(pageNumber: number): any {
    const position = (this.scrollPosition * -1) + this.screenHeight * pageNumber;
    
    return {
      'top': `${position}px`
    };
  }

  public updatePlanet() {
    return {
      opacity: this.getPositionOnPercentage(1, 0, this.calculPercentage(2)),
      scale: this.getPositionOnPercentage(1, 1.3, this.calculPercentage(2)),
    };
  }

  public updatePlanet2(): any {
    const percentage: number = this.calculPercentage(8);

    if (percentage > 200) {
      return {
        'transform': `scale(2) translate3d(0, 0, 0)`,
        'opacity': 0,
        'display': 'none'
      }
    }

    return {
      'opacity': this.getPositionOnPercentage(0, 1, percentage),
      'display': 'block'
    }
  }

  private calculPercentage(pageIndex: number): number {
    const end: number = this.screenHeight * pageIndex
    const start: number = end - this.screenHeight

    const percentage: number = ((this.scrollPosition - start) / (end -  start)) * 100

    if (percentage < 0) {
      return 0
    }

    return percentage
  }

  public getPositionForPage(start: number, end: number, pageIndex: number): number {
    const result = start + (this.calculPercentage(pageIndex) / 100 * (end - start));

    if (result < 0) {
      return 0;
    }
    
    return result
  }

  public getPositionForPage2(start: number, end: number, pageSet: number[]): number {
    const result = start + (this.calculPercentage2(pageSet) / 100 * (end - start));

    if (result < 0) {
      return 0;
    }
    
    return result
  }

  public calculPercentage2(pageSet: number[]): number {
    const end: number = this.screenHeight * pageSet[1];
    const start: number = end - this.screenHeight * (pageSet[1] - pageSet[0]);

    const percentage: number = ((this.scrollPosition - start) / (end -  start)) * 100;

    return percentage
  }

  public getPositionOnPercentage(start: number, end: number, percentage: number): number {
    return start + (percentage / 100 * (end - start));
  }

  public appearDisappear(page: number) {
    if (this.currentPageIndex == page) {
      return {
        'opacity': 1,
        'margin-top': 0 + 'px'
      }
    } else if (this.currentPageIndex > page) {
      return {
        'opacity': 0,
        'margin-top': -100 + 'px'
      }
    }

    return {
      'opacity': 0,
      'margin-top': 100 + 'px'
    } 
  }

  public stretch(page: number) {
    if (this.currentPageIndex == page) {
      return {
        'opacity': 1,
        'margin-top': 0 + 'px'
      };
    } else if (this.currentPageIndex > page) {
      return {
        'opacity': 1,
        'margin-top': 0 + 'px',
        'letter-spacing': this.screenWidth / 10 + 'px',
        'margin-right': (this.screenWidth / 10) * -1 + 'px'
      };
    }

    return {};
  }

  moveStarExposure() {
    if (this.currentPageIndex >= 12) {
      return 'pause';
    }
    if (this.currentPageIndex >= 10) {
      return 'play';
    }

    return 'stop';
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.scrollPosition = window.scrollY;

    if (this.currentPageIndex >= 10) {
      this.autoScroll.activateAutoScroll();
    }
    else {
      this.autoScroll.stopAutoScroll();
    }

    this.currentPageIndex = this.getPageIndexFromScroll();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMoveEvent(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    this.calculateMouseOffsetFromCenter();
  }
}