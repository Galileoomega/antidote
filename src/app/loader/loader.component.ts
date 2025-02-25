import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  
  ngOnInit() {
    setInterval(() => {
      this.progress += 10
    }, 900);
  }

  generateSVGOnPercentage() {
    const circumference = 2 * Math.PI * this.radius;
    const offset = circumference - (this.progress / 100) * circumference;
    
    return [circumference, offset];
  }
}
