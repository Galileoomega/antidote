import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil, Subject } from 'rxjs';
import { Project } from '../../models/project.model';
import { ProjectsService } from '../../../core/services/projects.service';
import { CRouterService } from '../../../core/services/c-router.service';
import { DeviceDetectorService } from '../../../core/services/device-detector.service';
import { ScrollPositionService } from '../../../core/services/scroll-position.service';

@Component({
  selector: 'app-projects-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-preview.component.html',
  styleUrls: ['./projects-preview.component.scss'],
})
export class ProjectsPreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('tracking') targets!: QueryList<ElementRef>;

  @Input() hideTexts: boolean = false;
  @Input() maxProjects: number = Infinity;
  public PROJECTS: Project[] = [];
  public displayedProjects: Project[] = [];
  public transformStyles: string[] = [];
  private targetRotations: { rotateX: number; rotateY: number }[] = [];
  private currentRotations: { rotateX: number; rotateY: number }[] = [];
  public animateSliding = false;

  private readonly SMOOTHING_FACTOR = 0.1;
  public readonly TRANSITION_TIME_MILLISECOND = 500;
  private destroy$ = new Subject<void>();

  private intersectionObserver!: IntersectionObserver;
  private animationFrameId: number = 0;

  private isMobile: boolean = false;

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private scrollPositionService: ScrollPositionService,
    private crouter: CRouterService,
    private deviceDetector: DeviceDetectorService
  ) {
    deviceDetector.isMobile$.subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });
  }

  /**
   * Initializes the component by loading projects data and setting up perspective.
   */
  ngOnInit(): void {
    this.PROJECTS = this.projectsService.getAllProjects();
    this.displayedProjects = this.PROJECTS.slice(0, this.maxProjects);
    
    if(this.isMobile == true) {
      return;
    }

    this.initializePerspectiveData();
  }

  /**
   * Sets up the intersection observer and router events after view initialization.
   */
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.setupIntersectionObserver();
      
      if(this.isMobile == true) {
        return;
      }
  
      this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd && event.url === '/'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.animateSliding = false;
      });
      
      // Start the animation loop.
      this.startAnimationLoop();
    }
  }

  /**
   * Cleans up subscriptions, disconnects the observer, and cancels the animation frame.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if(this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Navigates to the project details page with a sliding animation.
   */
  public openProject(index: number): void {
    this.scrollPositionService.saveScrollPosition();
    this.animateSliding = true;
    const projectId = this.displayedProjects[index].id;
    this.crouter.navigateTo(`project/${projectId}`);
  }

  /**
   * Initializes the intersection observer for tracking elements.
   */
  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('item-active');
          } else {
            entry.target.classList.remove('item-active');
          }
        });
      },
      { threshold: 0.1 }
    );

    this.targets.forEach((target) =>
      this.intersectionObserver.observe(target.nativeElement)
    );
  }

  /**
   * Initializes perspective data for projects and sets up rotation arrays.
   */
  private initializePerspectiveData(): void {
    const count = this.displayedProjects.length;
    this.transformStyles = Array(count).fill('');
    this.targetRotations = Array(count).fill({}).map(() => ({ rotateX: 0, rotateY: 0 }));
    this.currentRotations = Array(count).fill({}).map(() => ({ rotateX: 0, rotateY: 0 }));
  }

  /**
   * Updates the image perspective based on mouse movement.
   */
  public updateImagePerspective(event: MouseEvent, index: number): void {
    const item = (event.target as HTMLElement).closest('.item');
    if (!item) return;
    const box = item.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    this.targetRotations[index] = { rotateX: y * 15, rotateY: -x * 15 };
  }

  /**
   * Resets the image perspective to its default state.
   */
  public resetImagePerspective(index: number): void {
    this.targetRotations[index] = { rotateX: 0, rotateY: 0 };
  }

  /**
   * Starts the animation loop using requestAnimationFrame.
   */
  private startAnimationLoop(): void {
    const animate = () => {
      this.applySmoothPerspectiveEffect();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Smoothly interpolates rotations for a natural effect and updates transform styles.
   */
  private applySmoothPerspectiveEffect(): void {
    this.currentRotations.forEach((rotation, index) => {
      rotation.rotateX += (this.targetRotations[index].rotateX - rotation.rotateX) * this.SMOOTHING_FACTOR;
      rotation.rotateY += (this.targetRotations[index].rotateY - rotation.rotateY) * this.SMOOTHING_FACTOR;
      this.transformStyles[index] = `perspective(800px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`;
    });
  }

  /**
   * Navigates to the specified URL using the custom router service.
   */
  public navigateTo(url: string): void {
    this.crouter.navigateTo(url);
  }
}