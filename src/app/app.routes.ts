import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ContactComponent } from './features/contact/contact.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ProjectInfosComponent } from './features/project-infos/project-infos.component';
import { delayResolver } from './core/resolvers/delay.resolver';
import { AboutComponent } from './features/about/about.component';

export const routes: Routes = [
    { path: "", component: HomeComponent, resolve: {delay: delayResolver} },
    { path: "contact", component: ContactComponent, resolve: {delay: delayResolver} },
    { path: "projects", component: ProjectsComponent, resolve: {delay: delayResolver} },
    { path: "about", component: AboutComponent, resolve: {delay: delayResolver} },
    { path: "project/:id", component: ProjectInfosComponent, resolve: {delay: delayResolver} },
    { path: '**', redirectTo: '' }
];