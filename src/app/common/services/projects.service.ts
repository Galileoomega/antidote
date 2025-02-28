import { Injectable } from '@angular/core';
import { Project } from '../../common/models/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projects: Project[] = [
    {
      id: 'antidote-gems',
      title: 'Antidote Gems',
      description: 'E-commerce website, selling unique gemstones. Giving energies, love, strength. From design to final website implementation.',
      services: ['UI/UX', 'Concept', 'Development', 'Branding'],
      client: 'Apple Inc.',
      websiteUrl: 'https://example.com',
      previewImage: 'images/jade.jpg',
      tags: 'WEB • DESIGN',
      images: [
        { url: 'https://via.placeholder.com/250', name: 'Homepage' },
        { url: 'https://via.placeholder.com/250', name: 'Products' },
        { url: 'https://via.placeholder.com/250', name: 'Product Detail' },
        { url: 'https://via.placeholder.com/250', name: 'Cart' },
        { url: 'https://via.placeholder.com/250', name: 'Checkout' }
      ]
    },
    {
      id: 'halte-geneva',
      title: 'HALTE Geneva',
      description: 'Theatrical design and brochure creation for HALTE Geneva, showcasing their artistic performances and cultural events.',
      services: ['Theatrical Design', 'Brochure Design', 'Print Media'],
      client: 'HALTE Geneva',
      previewImage: '',
      tags: 'THEATRAL • DESIGN • BROCHURE',
      images: [
        { url: 'https://via.placeholder.com/250', name: 'Brochure Cover' },
        { url: 'https://via.placeholder.com/250', name: 'Interior Pages' },
        { url: 'https://via.placeholder.com/250', name: 'Event Posters' }
      ]
    }
  ];

  getAllProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | null {
    return this.projects.find(project => project.id === id) || null;
  }
} 