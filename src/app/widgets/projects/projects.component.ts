import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Project } from '../../common/models/project.interface';
import { ProjectsService } from '../../common/services/projects.service';
import { ScrollPositionService } from '../../common/services/scroll-position.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChildren('tracking') targets!: QueryList<ElementRef>;

  // Projects data
  public readonly PROJECTS: Project[];

  public transformStyles: string[] = [];
  private targetRotations: { rotateX: number; rotateY: number }[] = [];
  private currentRotations: { rotateX: number; rotateY: number }[] = [];
  public animateSliding = false;
  
  private readonly SMOOTHING_FACTOR = 0.02;
  public readonly TRANSITION_TIME_MILLISECOND = 500;

  constructor(private router: Router, private projectsService: ProjectsService, private scrollPositionService: ScrollPositionService) {
    this.PROJECTS = this.projectsService.getAllProjects();
    this.initializePerspectiveData();

    // Listen for navigation events to handle return animation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/') {
        // Reset animation state when returning to projects
        this.animateSliding = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  /**
   * Navigates to the project details page with a sliding animation.
   */
  public openProject(index: number): void {
    this.scrollPositionService.saveScrollPosition();
    this.animateSliding = true;
    const projectId = this.PROJECTS[index].id;
    setTimeout(() => this.router.navigateByUrl(`projects/${projectId}`), this.TRANSITION_TIME_MILLISECOND + 100);
  }

  /**
   * Initializes the intersection observer for tracking elements.
   */
  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            `${entry.target.className}-active`,
            entry.isIntersecting
          );
        });
      },
      { threshold: 0.1 }
    );

    this.targets.forEach((target) => observer.observe(target.nativeElement));
  }

  /**
   * Initializes perspective data and starts the animation loop.
   */
  private initializePerspectiveData(): void {
    this.transformStyles = new Array(this.PROJECTS.length).fill('');
    this.targetRotations = this.PROJECTS.map(() => ({ rotateX: 0, rotateY: 0 }));
    this.currentRotations = this.PROJECTS.map(() => ({ rotateX: 0, rotateY: 0 }));
    setInterval(() => this.applySmoothPerspectiveEffect(), 17);
  }

  /**
   * Updates the image perspective based on mouse movement.
   */
  public updateImagePerspective(event: MouseEvent, index: number): void {
    const box = (event.target as HTMLElement).closest('.item')!.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    this.targetRotations[index] = { rotateX: y * 30, rotateY: -x * 30 };
  }

  /**
   * Resets the image perspective to its default state.
   */
  public resetImagePerspective(index: number): void {
    this.targetRotations[index] = { rotateX: 0, rotateY: 0 };
  }

  /**
   * Smoothly interpolates rotations for a natural effect.
   */
  private applySmoothPerspectiveEffect(): void {
    this.currentRotations.forEach((rotation, index) => {
      rotation.rotateX += (this.targetRotations[index].rotateX - rotation.rotateX) * this.SMOOTHING_FACTOR;
      rotation.rotateY += (this.targetRotations[index].rotateY - rotation.rotateY) * this.SMOOTHING_FACTOR;
      this.transformStyles[index] = `perspective(800px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`;
    });
  }
}
