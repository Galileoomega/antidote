import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  smoothingFactor = 0.3; // Custom smoothing factor (0.0 - 1.0), smaller = smoother
  isExiting = false;

  projectId: string | null = null;
  project: Project | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      if (this.projectId) {
        this.project = this.projectsService.getProjectById(this.projectId);
      }
    });

    this.smoothUpdate()
  }

  onScroll(event: WheelEvent) {
    event.preventDefault();
    // Update the target position based on the wheel event
    this.targetPosition -= event.deltaY;
    
    if (this.targetPosition < 0) {
      this.targetPosition = 0;
    }
  }

  smoothUpdate() {
    const update = () => {
      this.currentPosition += (this.targetPosition - this.currentPosition) * this.smoothingFactor;
      this.cdr.detectChanges(); // Trigger change detection
      requestAnimationFrame(update); // Use requestAnimationFrame for smoother updates
    };
    requestAnimationFrame(update);
  }

  updateScrollPosition() {
    // Custom smoothing logic: Linear interpolation with a custom factor

    // Apply the smooth scroll transform using translate3d
    return {'transform': `translate3d(${-this.currentPosition}px, 0, 0)`};
  }

  visitWebsite() {
    if (this.project?.websiteUrl) {
      window.open(this.project.websiteUrl, '_blank');
    }
  }

  goBack() {
    this.isExiting = true;
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300); // Match the animation duration
  }
}
