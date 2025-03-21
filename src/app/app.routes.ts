import { Routes } from '@angular/router';
import { ContactComponent } from './interface/contact/contact.component';
import { HomeComponent } from './interface/home/home.component';
import { ProjectInfosComponent } from './interface/project-infos/project-infos.component';
import { ProjectsComponent } from './interface/projects/projects.component';
import { delayResolver } from './common/resolvers/delay.resolver';

export const routes: Routes = [
    { path: "", component: HomeComponent, resolve: {delay: delayResolver} },
    { path: "contact", component: ContactComponent, resolve: {delay: delayResolver} },
    { path: "projects", component: ProjectsComponent, resolve: {delay: delayResolver} },
    { path: "projects/:id", component: ProjectInfosComponent, resolve: {delay: delayResolver} },
    { path: '**', redirectTo: '' }
];
