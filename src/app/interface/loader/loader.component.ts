import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../../common/services/loader.service';
import { NavigationStart, Router } from '@angular/router';
import { ScrollPositionService } from '../../common/services/scroll-position.service';
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  progress = 0;
  radius = 50;
  hide = false

  constructor(private router: Router, private loaderService: LoaderService, private scrollPositionService: ScrollPositionService) {
    this.router.events.subscribe(event => {
      console.log(this.scrollPositionService.scrollPositions.size)
      if (event instanceof NavigationStart && this.progress >= 100) {
        this.hide = false
        setTimeout(() => {
          this.hide = true
        }, 1100);
      }
    });
  }
  
  ngOnInit() {
    this.loaderService.currentData$.subscribe((data) => {
      this.progress = data;

      if (this.progress >= 100) {
        setTimeout(() => {
          this.hide = true
        }, 1000);
      }
      else {
        this.hide = false;
      }
    });
  }

  generateSVGOnPercentage() {
    const circumference = 2 * Math.PI * this.radius;
    const offset = circumference - (this.progress / 100) * circumference;
    
    return [circumference, offset];
  }
}