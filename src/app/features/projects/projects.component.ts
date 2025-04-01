import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPreviewComponent } from '../../shared/components/projects-preview/projects-preview.component';
import { CRouterService } from '../../core/services/c-router.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectsPreviewComponent, FooterComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  private loadedImageCount: number = 0;
  private readonly imageCount: number = 1;
  
  constructor(private crouter: CRouterService) {}

  public imageLoaded() {
    this.loadedImageCount++;

    if(this.loadedImageCount >= this.imageCount) {
      this.crouter.acceptNavigation();
    }
  }
}
