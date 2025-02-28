import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';

@Component({
  selector: 'app-project-infos',
  imports: [CommonModule],
  templateUrl: './project-infos.component.html',
  styleUrl: './project-infos.component.scss'
})
export class ProjectInfosComponent {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  targetPosition = 0;  // The target scroll position
  currentPosition = 0; // The current scroll position
  smoothingFactor = 0.2; // Custom smoothing factor (0.0 - 1.0), smaller = smoother

  items = [
    { image: 'https://via.placeholder.com/250', name: 'Item 1' },
    { image: 'https://via.placeholder.com/250', name: 'Item 2' },
    { image: 'https://via.placeholder.com/250', name: 'Item 3' },
    { image: 'https://via.placeholder.com/250', name: 'Item 4' },
    { image: 'https://via.placeholder.com/250', name: 'Item 5' }
  ];

  onScroll(event: WheelEvent) {
    event.preventDefault();
    // Update the target position based on the wheel event
    this.targetPosition -= event.deltaY > 0 ? -100 : 100;
    
    if (this.targetPosition < 0) {
      this.targetPosition = 0;
    }
  }

  updatePosition() {
    // Custom smoothing logic: Linear interpolation with a custom factor
    this.currentPosition += (this.targetPosition - this.currentPosition) * this.smoothingFactor;

    // Apply the smooth scroll transform using translate3d
    this.carousel.nativeElement.style.transform = `translate3d(${-this.currentPosition}px, 0, 0)`;
  }

  ngAfterViewInit() {
    // Continuously update the position to apply the smooth transition
    setInterval(() => {
      this.updatePosition();
    }, 0.1); // Roughly 60 frames per second (16ms per frame)
  }
}
