import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../../common/services/loader.service';

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

  constructor(
    private loaderService: LoaderService
  ) {}
  
  ngOnInit() {
    this.loaderService.currentData$.subscribe((data) => {
      this.progress = data;

      if (this.progress >= 100) {
        setInterval(() => {
          this.hide = true
        }, 1000)
      }
    });
  }

  generateSVGOnPercentage() {
    const circumference = 2 * Math.PI * this.radius;
    const offset = circumference - (this.progress / 100) * circumference;
    
    return [circumference, offset];
  }
}