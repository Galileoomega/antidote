import { Routes } from '@angular/router';
import { ContactComponent } from './interface/contact/contact.component';
import { HomeComponent } from './interface/home/home.component';
import { ProjectInfosComponent } from './interface/project-infos/project-infos.component';
import { ProjectsComponent } from './interface/projects/projects.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "contact", component: ContactComponent },
    { path: "projects", component: ProjectsComponent },
    { path: "projects/:id", component: ProjectInfosComponent },
    { path: '**', redirectTo: '' }
];
