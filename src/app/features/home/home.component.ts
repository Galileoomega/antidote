import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { NebulaComponent } from '../../shared/components/nebula/nebula.component';
import { ProjectsPreviewComponent } from '../../shared/components/projects-preview/projects-preview.component';
import { StarRainComponent } from '../../shared/components/star-rain/star-rain.component';
import { PlanetGenComponent } from '../../shared/components/planet-gen/planet-gen.component';
import { StarExposureComponent } from '../../shared/components/star-exposure/star-exposure.component';
import { ScramblerTextComponent } from '../../shared/components/scrambler-text/scrambler-text.component';
import { CRouterService } from '../../core/services/c-router.service';
import { DeviceDetectorService } from '../../core/services/device-detector.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, 
    ScramblerTextComponent, 
    StarExposureComponent, 
    PlanetGenComponent, 
    StarRainComponent,
    ProjectsPreviewComponent,
    NebulaComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './home-mobile.component.scss']
})
export class HomeComponent implements OnInit {
  // Store the current coordinates of the mouse.
  private mouseX: number = 0;
  private mouseY: number = 0;

  // Store the current scroll position.
  public scrollPosition: number = 0;

  // Screen dimmensions.
  public screenWidth: number = 0;
  public screenHeight: number = 0;

  // The offset amount from the center of the screen (in pixel).
  private mouseOffsetX!: number;
  private mouseOffsetY!: number;

  public currentPageIndex: number = 0;

  public clientIsMobile: boolean = false;

  constructor(
    private crouter: CRouterService,
    private deviceDetector: DeviceDetectorService
  ) {
    deviceDetector.isMobile$.subscribe((isMobile: boolean) => {
      this.clientIsMobile = isMobile;
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      
      this.crouter.acceptNavigation();
    }
  }

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

  public navigateTo(url: string) {
    this.crouter.navigateTo(url);
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
      case "nebula":
        styles['transform'] = `translate(-50%, -50%) perspective(500px) rotateX(${(this.mouseOffsetY * -1) * 0.5}deg) rotateY(${this.mouseOffsetX * 0.5}deg)`;
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

    if (isNaN(result)) {return start}
    
    if (result < 0) {
      return 0;
    }
    
    return result;
  }

  public getPositionForPage2(start: number, end: number, pageSet: number[]): number {
    const result = start + (this.calculPercentage2(pageSet) / 100 * (end - start));

    if (result < 0) {
      return 0;
    }
    
    return result;
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
        'margin-top': 0 + 'px',
        'letter-spacing': this.getPositionForPage(0, this.screenWidth / 10, page) + 'px',
        'margin-right': this.getPositionForPage(0, this.screenWidth / 10, page) * -1 + 'px'
      }
    }
    if (this.currentPageIndex > page) {
      return {
        'opacity': 1,
        'margin-top': 0 + 'px',
        'letter-spacing': this.screenWidth / 10 + 'px',
        'margin-right': (this.screenWidth / 10) * -1 + 'px'
      }
    }

    return {};
  }

  @HostListener('window:scroll', [])
  onWindowScroll(event: any = null): void {
    if(event) {
      this.scrollPosition = event.target.scrollTop;
    }
    else {
      this.scrollPosition = window.scrollY;
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