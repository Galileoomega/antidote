import { RenderMode, ServerRoute } from '@angular/ssr';
import { ProjectsService } from './core/services/projects.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'project/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = new ProjectsService();
      const ids = await dataService.getProjectIds(); // Assuming this returns ['1', '2', '3']
      return ids.map(id => ({ id })); // Transforms IDs into an array of objects for prerendering
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  },
];
