import { CommonModule, ViewportScroller } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { fromEvent, interval, take, throttleTime, timer } from 'rxjs';
import { ScrollbarComponent } from '../../widgets/scrollbar/scrollbar.component';
import { ScramblerTextComponent } from '../../widgets/scrambler-text/scrambler-text.component';
import { RouterLink } from '@angular/router';
import { StarExposureComponent } from '../../widgets/star-exposure/star-exposure.component';
import { PlanetGenComponent } from '../../widgets/planet-gen/planet-gen.component';

interface StarPosition {
  x: number;
  y: number;
}

interface Project {
  image: string;
  tags: string;
  name: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, ScrollbarComponent, ScramblerTextComponent, StarExposureComponent, RouterLink, PlanetGenComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  
})
export class HomeComponent implements AfterViewInit, OnInit {
  @ViewChildren('tracking') targets!: QueryList<ElementRef>;

  // Stars positions array.
  private readonly STARS_POSITIONS_RATIO: StarPosition[] = [
    {x: 5, y: 15},
    {x: 20, y: 20},
    {x: 20, y: 40},
    {x: 20, y: 70},
    {x: 40, y: 30},
    {x: 50, y: 20},
    {x: 80, y: 25},
    {x: 50, y: 50},
    {x: 55, y: 70},
    {x: 80, y: 85},
    {x: 40, y: 85},
    {x: 10, y: 80},
    {x: 10, y: 50},
    {x: 80, y: 45},
    {x: 75, y: 55},
    {x: -10, y: 40},
    {x: -10, y: 10},
    {x: 20, y: 90},
    {x: 90, y: 10},
    {x: 60, y: 95},
    {x: 90, y: 70},
    {x: 90, y: 40},
    {x: 40, y: 54},
    {x: 63, y: 50},
    {x: 100, y: 100},
    {x: 100, y: 120},
    {x: 5, y: 100},
    {x: 55, y: 100},
    {x: 55, y: 10},
  ];

  // Selected project list.
  public readonly PROJECTS: Project[] = [
    {
      image: "images/jade.jpg",
      tags: "WEB • DESIGN",
      name: "Antidote Gems"
    },
    {
      image: "",
      tags: "THEATRAL • DESIGN • BROCHURE",
      name: "HALTE Geneva"
    },
    {
      image: "images/jade.jpg",
      tags: "WEB • DESIGN",
      name: "Antidote Gems"
    },
    {
      image: "",
      tags: "WEB • DESIGN",
      name: "Antidote Gems"
    }
  ];

  // Store the current coordinates of the mouse.
  private mouseX: number = 0;
  private mouseY: number = 0;

  // Store the current scroll position.
  public scrollPosition: number = 0;

  // Screen dimmensions.
  public screenWidth: number = window.innerWidth;
  public screenHeight: number = window.innerHeight;

  // Contains css style of the stars.
  public stars: any[] = [];

  // The offset amount from the center of the screen (in pixel).
  private mouseOffsetX!: number;
  private mouseOffsetY!: number;

  public currentPageIndex: number = 0;

  public transformStyles: string[] = [];
  private targetRotations: { rotateX: number; rotateY: number }[] = [];
  private currentRotations: { rotateX: number; rotateY: number }[] = [];
  private readonly SMOOTHING_FACTOR: number = 0.02;

  constructor() {
    this.generateStarsStyle();
    this.initPerspective();
  }

  private oldScrollPosition: number = 0;
  private scrollDirection: 'up' | 'down' | 'none' = 'none';

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.scrollPosition = window.scrollY;
    
    // DETECT SCROLL DOWN
    if(this.oldScrollPosition < this.scrollPosition) {
      this.scrollDirection = 'down';
    }
    // DETECT SCROLL UP
    else {
      this.scrollDirection = 'up';
    }

    if (this.currentPageIndex >= 10) {
      this.activateAutoScroll();
    }
    else {
      this.stopAutoScroll();
    }

    this.oldScrollPosition = this.scrollPosition;

    this.currentPageIndex = this.getPageIndexFromScroll();
  }

  private autoScrollInterval: any;
  private autoScrollSpeed = 1; // Adjust the speed as needed

  activateAutoScroll(): void {
    if (!this.autoScrollInterval) {
      this.autoScrollInterval = setInterval(() => {
        
        if(this.scrollDirection == 'down') {
          window.scrollBy(0, 5);
        }
        else {
          window.scrollBy(0, -5);
        }

        this.scrollPosition = window.scrollY;

        if (this.scrollPosition + window.innerHeight >= document.body.scrollHeight) {
          this.stopAutoScroll();
        }
      }, this.autoScrollSpeed);
    }
  }

  stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
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

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initIntersectionObserver(this.targets);
  }

  private initPerspective(): void {
    this.transformStyles = new Array(this.PROJECTS.length).fill('');
    this.targetRotations = this.PROJECTS.map(() => ({ rotateX: 0, rotateY: 0 }));
    this.currentRotations = this.PROJECTS.map(() => ({ rotateX: 0, rotateY: 0 }));
    
    setInterval(() => this.applyImagePerspective(), 17);
  }

  private initIntersectionObserver(targets: QueryList<ElementRef>): void {
    const options = { 
      root: null,
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.classList.length <= 1) {
            entry.target.classList.add(entry.target.className+'-active');
          }
          else {
            entry.target.classList.remove(entry.target.className+'-active');
          }
        });
      },
      options
    );

    if (targets) {
      targets.forEach((target) => {
        observer.observe(target.nativeElement);
      });
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

  public updateImagePerspective(event: MouseEvent, index: number): void {
    const box = (event.target as HTMLElement).closest('.item')!.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;

    this.targetRotations[index] = { rotateX: y * 30, rotateY: -x * 30 };
  }

  public resetImagePerspective(index: number) {
    this.targetRotations[index] = { rotateX: 0, rotateY: 0 };
  }

  private applyImagePerspective(): void {
    this.currentRotations.forEach((rotation, index) => {
      rotation.rotateX += (this.targetRotations[index].rotateX - rotation.rotateX) * this.SMOOTHING_FACTOR;
      rotation.rotateY += (this.targetRotations[index].rotateY - rotation.rotateY) * this.SMOOTHING_FACTOR;

      this.transformStyles[index] = `perspective(800px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`;
    });
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

  public moveByMouseOffset(bodyId: string, speedFactor: number) {
    switch(bodyId) {
      case "planet-1": 
        return {
          'left': 'calc(50% + ' + (this.mouseOffsetX / 2) * speedFactor + 'px)',
          'top': 'calc(50% + ' + (this.mouseOffsetY / 2) * speedFactor + 'px)',
        }

      case "sat-1": 
        return {
          'left': 'calc(10vw + ' + (this.mouseOffsetX / 2) * speedFactor + 'px)',
          'bottom': 'calc(10vh + ' + ((this.mouseOffsetY * -1) / 2) * speedFactor + 'px)',
        }

      case "sat-2": 
        return {
          'right': 'calc(10vw + ' + (this.mouseOffsetX / 2) * speedFactor + 'px)',
          'top': 'calc(10vh + ' + ((this.mouseOffsetY * -1) / 2) * speedFactor + 'px)',
        }

      default:
        return {}
    }
  }

  public fixToPage(pageNumber: number): any {
    const position = (this.scrollPosition * -1) + this.screenHeight * pageNumber;
    
    return {
      'top': `${position}px`
    };
  }

  public fixToPageThenScreen(pageNumber: number): any {
    const position = (this.scrollPosition * -1) + this.screenHeight * pageNumber;
    
    if (position <= 0) {
      return {
        'top': `0px`
      };
    }
    
    return {
      'top': `${position}px`
    };
  }

  public updatePlanet(): any {
    const percentage: number = this.calculPercentage(2);

    if (percentage > 100) {
      return {
        'transform': `scale(2) translate3d(0, 0, 0)`,
        'opacity': 0
      }
    }

    return {
      'transform': `scale(${this.getPositionOnPercentage(1, 2, percentage)}) translate3d(0, 0, 0)`,
      'opacity': this.getPositionOnPercentage(1, 0, percentage)
    }
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

  private generateStarsStyle(): void {
    this.STARS_POSITIONS_RATIO.forEach(positionsRatio => {
      const randomOriginPosition: number = this.getRandomNumber(50, 700);

      const x: number = this.calculatePercentageValue(positionsRatio.x, this.screenWidth);
      const y: number = this.calculatePercentageValue(positionsRatio.y, this.screenHeight);

      this.stars.push({
        'xStart': x + randomOriginPosition,
        'yStart': y + randomOriginPosition,
        'xEnd': x,
        'yEnd': y,
        'top': '',
        'left': '',
        'opacity': ''
      });
    });
  }

  public updateStarsPositions(): Array<any> | undefined {
    let percentage = this.calculPercentage(3);
    
    if (percentage == 0) {
      return;
    }

    this.stars.forEach(star => {
      star.left = `${this.getPositionOnPercentage(star.xStart, star.xEnd, percentage)}px`;
      star.top = `${this.getPositionOnPercentage(star.yStart, star.yEnd, percentage)}px`;
      
      if (percentage > 100) {
        star.opacity = this.getPositionOnPercentage(1, 0, this.calculPercentage(4));
      }
      else {
        star.opacity = this.getPositionOnPercentage(0, 1, percentage);
      }
    });

    return this.stars;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private calculatePercentageValue(percentage: number, number: number): number {
    return (number * percentage) / 100;
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

  // ANIMATION FUNCTIONS

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
    return this.currentPageIndex >= 10 && this.currentPageIndex < 13
  }
}
