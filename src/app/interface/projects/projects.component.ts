import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPreviewComponent } from '../../widgets/projects-preview/projects-preview.component';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectsPreviewComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  
}
