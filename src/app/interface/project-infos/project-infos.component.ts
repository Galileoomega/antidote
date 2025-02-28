import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../common/models/project.interface';
import { ProjectsService } from '../../common/services/projects.service';

@Component({
  selector: 'app-project-infos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-infos.component.html',
  styleUrl: './project-infos.component.scss'
})
export class ProjectInfosComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  targetPosition = 0;  // The target scroll position
  currentPosition = 0; // The current scroll position
  smoothingFactor = 0.2; // Custom smoothing factor (0.0 - 1.0), smaller = smoother

  projectId: string | null = null;
  project: Project | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      if (this.projectId) {
        this.project = this.projectsService.getProjectById(this.projectId);
      }
    });
  }

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

  visitWebsite() {
    if (this.project?.websiteUrl) {
      window.open(this.project.websiteUrl, '_blank');
    }
  }
}
