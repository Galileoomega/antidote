import { Injectable } from '@angular/core';
import { Project } from '../../shared/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projects: Project[] = [
    {
      id: 'techno-posters',
      title: 'Techno Posters',
      description: 'A collection of vibrant and dynamic posters designed for an event at L\'Usine. The visuals reflect the raw energy and underground spirit of the event, combining bold typography and electrifying graphics.',
      services: ['Graphic Design', 'Poster', 'Visual Identity', 'Print Media'],
      client: 'L\'usine',
      tags: 'CONCEPT • DESIGN • POSTER',
      thumbnail: 'projects/techno-posters/plana-1.webp',
      medias: [
        { type: 'image', url: 'projects/techno-posters/plana-2.jpg', name: 'Products' },
        { type: 'image', url: 'projects/techno-posters/plana-3.jpg', name: 'Product Detail' },
        { type: 'image', url: 'projects/techno-posters/plana-4.jpg', name: 'Cart' },
        { type: 'image', url: 'projects/techno-posters/plana-5.jpg', name: 'Checkout' },
        { type: 'image', url: 'projects/techno-posters/plana-6.jpg', name: 'Checkout' },
      ]
    },
    {
      id: 'halte-geneva',
      title: 'HALTE Geneva',
      description: 'A captivating theatrical design and brochure creation for HALTE Geneva, reflecting the essence of their artistic performances and cultural events.',
      services: ['Theatrical Design', 'Brochure Design', 'Print Media'],
      client: 'Comédie de Genève',
      tags: 'DESIGN • BROCHURE • THEATRAL',
      thumbnail: 'projects/halte/cover.webp',
      medias: [
        { type: 'image', url: 'projects/halte/1.webp', name: 'Products' },
        { type: 'image', url: 'projects/halte/2.webp', name: 'Products' },
        { type: 'image', url: 'projects/halte/3.webp', name: 'Products' },
        { type: 'image', url: 'projects/halte/4.webp', name: 'Products' },
        { type: 'image', url: 'projects/halte/5.webp', name: 'Products' }
      ]
    },
    {
      id: 'aeris',
      title: 'AERIS',
      description: 'Presentation website for Aeris Dynamics, showcasing their cutting-edge human-sized VTOL drone. The drone structure has been designed in 3D for more immersive presentation.',
      services: ['Web Design', 'UI/UX', 'Development', 'Branding', '3D', 'Motion Design'],
      client: 'Aeris Dynamics',
      websiteUrl: 'https://aeris-dynamics.netlify.app/',
      tags: '3D • WEB • DESIGN • MOTION DESIGN',
      thumbnail: 'projects/aeris/cover.webp',
      medias: [
        { type: 'video', url: 'projects/aeris/2.mp4', name: 'Products' },
        { type: 'video', url: 'projects/aeris/3.mp4', name: 'Cart' },
        { type: 'image', url: 'projects/aeris/2.jpg', name: 'Product Detail' },
        { type: 'image', url: 'projects/aeris/4.jpg', name: 'Checkout' },
        { type: 'image', url: 'projects/aeris/5.jpg', name: 'Checkout' },
      ]
    }
  ];

  getAllProjects(): Project[] {
    return this.projects;
  }

  // Function to return all the ids of the projects
  getProjectIds(): string[] {
    return this.projects.map(project => project.id);
  }

  getProjectById(id: string): Project | null {
    return this.projects.find(project => project.id === id) || null;
  }
} 