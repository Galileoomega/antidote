import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

interface Project {
  image: string;
  tags: string;
  name: string;
};

@Component({
  selector: 'app-projects',
  imports: [
    CommonModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  @ViewChildren('tracking') targets!: QueryList<ElementRef>;

  // Selected project list.
  public readonly PROJECTS: Project[] = [
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

  public transformStyles: string[] = [];
  private targetRotations: { rotateX: number; rotateY: number }[] = [];
  private currentRotations: { rotateX: number; rotateY: number }[] = [];

  private readonly SMOOTHING_FACTOR: number = 0.02;

  constructor(
  ) {
    this.initPerspective();
  }

  private initIntersectionObserver(targets: QueryList<ElementRef>): void {
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
          else {
            entry.target.classList.remove(entry.target.className+'-active');
          }
        });
      },
      options
    );

    if (targets) {
      targets.forEach((target) => {
        observer.observe(target.nativeElement);
      });
    }
  }

  ngAfterViewInit() {
    this.initIntersectionObserver(this.targets);
  }

  private initPerspective(): void {
    this.transformStyles = new Array(this.PROJECTS.length).fill('');
    this.targetRotations = this.PROJECTS.map(() => ({ rotateX: 0, rotateY: 0 }));
    this.currentRotations = this.PROJECTS.map(() => ({ rotateX: 0, rotateY: 0 }));
    
    setInterval(() => this.applyImagePerspective(), 17);
  }

  public updateImagePerspective(event: MouseEvent, index: number): void {
    const box = (event.target as HTMLElement).closest('.item')!.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;

    this.targetRotations[index] = { rotateX: y * 30, rotateY: -x * 30 };
  }

  public resetImagePerspective(index: number) {
    this.targetRotations[index] = { rotateX: 0, rotateY: 0 };
  }

  private applyImagePerspective(): void {
    this.currentRotations.forEach((rotation, index) => {
      rotation.rotateX += (this.targetRotations[index].rotateX - rotation.rotateX) * this.SMOOTHING_FACTOR;
      rotation.rotateY += (this.targetRotations[index].rotateY - rotation.rotateY) * this.SMOOTHING_FACTOR;

      this.transformStyles[index] = `perspective(800px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`;
    });
  }
}
