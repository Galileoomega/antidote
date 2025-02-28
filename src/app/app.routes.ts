import { Routes } from '@angular/router';
import { ContactComponent } from './interface/contact/contact.component';
import { HomeComponent } from './interface/home/home.component';
import { ProjectInfosComponent } from './interface/project-infos/project-infos.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "contact", component: ContactComponent },
    { path: "projects", component: ProjectInfosComponent },
];
