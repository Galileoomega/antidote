import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { fromEvent, interval, take, throttleTime, timer } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  
})
export class HomeComponent implements AfterViewInit {
  public currentPageIndex: number = 1;

  private mouseX: number = 0;
  private mouseY: number = 0;

  private scrollPosition: number = 0;
  public screenWidth: number;
  public screenHeight: number;

  public stars: Array<any> = []
  private readonly STARS_POSITIONS_RATIO: Array<any> = [
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

  public readonly PROJECTS: any[] = [
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

  constructor() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.generateStarsStyle();

    this.transformStyles = new Array(this.PROJECTS.length).fill('');
    this.targetRotations = this.PROJECTS.map(() => ({ rotateX: 0, rotateY: 0 }));
    this.currentRotations = this.PROJECTS.map(() => ({ rotateX: 0, rotateY: 0 }));
    
    // Smoothly update rotation at a fixed interval
    setInterval(() => this.smoothUpdate(), 17); // Approx. 60FPS

    fromEvent<Event>(window, 'scroll')
      .pipe(throttleTime(50))
      .subscribe(() => this.onWindowScroll());
  }



  transformStyles: string[] = [];
  targetRotations: { rotateX: number; rotateY: number }[] = [];
  currentRotations: { rotateX: number; rotateY: number }[] = [];
  smoothingFactor = 0.02; // Adjust for smoother or faster transition

  onMouseMove(event: MouseEvent, index: number) {
    const box = (event.target as HTMLElement).closest('.item')!.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5; // Normalize (-0.5 to 0.5)
    const y = (event.clientY - box.top) / box.height - 0.5;

    this.targetRotations[index] = { rotateX: y * 30, rotateY: -x * 30 };
  }

  resetTransform(index: number) {
    this.targetRotations[index] = { rotateX: 0, rotateY: 0 };
  }

  smoothUpdate() {
    this.currentRotations.forEach((rotation, index) => {
      // Apply smoothing per image
      rotation.rotateX += (this.targetRotations[index].rotateX - rotation.rotateX) * this.smoothingFactor;
      rotation.rotateY += (this.targetRotations[index].rotateY - rotation.rotateY) * this.smoothingFactor;

      // Update only the hovered image
      this.transformStyles[index] = `perspective(800px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`;
    });
  }





  @ViewChildren('tracking') targets!: QueryList<ElementRef>;
  
  ngAfterViewInit() {
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
        });
      },
      options
    );

    if (this.targets) {
      this.targets.forEach((target) => {
        observer.observe(target.nativeElement);
      });
    }
  }

  // HOST LISTENER //

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.scrollPosition = window.scrollY;
    this.currentPageIndex = this.getPageIndexFromScroll();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  onMouseMove2(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    // Get the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate the mouse offset from the center
    const offsetX = this.mouseX - centerX;
    const offsetY = this.mouseY - centerY;

    // Calculate the percentage of the offset relative to the screen dimensions
    // console.log((offsetX / centerX) * 100, (offsetY / centerY) * 100)
  }

  fixToPage(pageNumber: number) {
    const position = (this.scrollPosition * -1) + this.screenHeight * pageNumber;
    
    return {
      'top': `${position}px`
    };
  }

  // PLANET ANIMATIONS //

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

  // STARS ANIMATIONS //

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

  public updateStarsPositions() {
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

  // OTHER FUNCTIONS //

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private calculatePercentageValue(percentage: number, number: number): number {
    return (number * percentage) / 100;
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

  private calculPercentage(pageIndex: number) {
    const end: number = this.screenHeight * pageIndex
    const start: number = end - this.screenHeight

    const percentage: number = ((this.scrollPosition - start) / (end -  start)) * 100

    if (percentage < 0) {
      return 0
    }

    return percentage
  }

  public getPositionForPage(start: number, end: number, pageIndex: number) {
    const result = start + (this.calculPercentage(pageIndex) / 100 * (end - start));

    if (result < 0) {
      return 0;
    }
    
    return result
  }

  public getPositionOnPercentage(start: number, end: number, percentage: number) {
    return start + (percentage / 100 * (end - start));
  }
}
