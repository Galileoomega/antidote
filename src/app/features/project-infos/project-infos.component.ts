import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../shared/models/project.model';
import { CRouterService } from '../../core/services/c-router.service';
import { ProjectsService } from '../../core/services/projects.service';

@Component({
  selector: 'app-project-infos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-infos.component.html',
  styleUrls: ['./project-infos.component.scss']
})
export class ProjectInfosComponent implements OnInit {
  @ViewChild('carousel') myElement!: ElementRef;

  targetPosition = 0;
  currentPosition = 0;
  smoothingFactor = 0.1;
  isExiting = false;
  projectId: string | null = null;
  project: Project | null = null;

  constructor(
    private route: ActivatedRoute,
    private crouter: CRouterService,
    private projectsService: ProjectsService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  /**
   * Initializes the component and subscribes to route parameters.
   */
  ngOnInit(): void {
    this.subscribeToRouteParams();
    this.smoothUpdate();
  }

  imgLoaded = 0

  public loaded() {
    this.imgLoaded++;

    if(this.imgLoaded > 0) {
      this.crouter.acceptNavigation();
    }
  }

  /**
   * Subscribes to route parameters and loads the project based on the `id`.
   */
  private subscribeToRouteParams(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      if (this.projectId) {
        this.loadProject();
      }
      else {
      }
      
      if(this.project == null) {
        this.crouter.navigateTo('/')
      }
    });
  }

  /**
   * Loads the project details based on the `projectId`.
   */
  private loadProject(): void {
    this.project = this.projectsService.getProjectById(this.projectId!);
  }

  /**
   * Handles the scroll event to update the target scroll position.
   * 
   * @param event - The wheel event
   */
  onScroll(event: WheelEvent): void {
    event.preventDefault();
    this.targetPosition = Math.max(0, this.targetPosition + event.deltaY);

    const endBound: number = this.getWidth() - window.innerWidth / 1 + 30;

    if(this.targetPosition > endBound) {
      this.targetPosition = endBound
    }
  }

  getWidth(): number {
    return this.myElement.nativeElement.offsetWidth;
  }

  /**
   * Smoothly updates the current scroll position.
   */
  private smoothUpdate(): void {
    try {
      const update = () => {
        this.currentPosition += (this.targetPosition - this.currentPosition) * this.smoothingFactor;
        this.cdr.detectChanges();
        requestAnimationFrame(update);
      };
      
      requestAnimationFrame(update);
    }
    catch {}
  }

  /**
   * Returns the CSS transform property for scroll positioning.
   * 
   * @returns The transform style object
   */
  public updateScrollPosition(): { transform: string } {
    return { transform: `translate3d(${-this.currentPosition}px, 0, 0)` };
  }

  /**
   * Opens the project's website URL in a new tab.
   */
  public visitWebsite(): void {
    if (this.project?.websiteUrl) {
      window.open(this.project.websiteUrl, '_blank');
    }
  }

  /**
   * Navigates back to the homepage with a slight delay.
   */
  public goBack(): void {
    this.isExiting = true;
    this.location.back();
  }
}
