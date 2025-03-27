import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPreviewComponent } from '../../shared/components/projects-preview/projects-preview.component';
import { CRouterService } from '../../core/services/c-router.service';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectsPreviewComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  
  constructor(private crouter: CRouterService) {
    this.crouter.acceptNavigation();
  }
}
