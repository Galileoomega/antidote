import { Injectable } from '@angular/core';
import { Project } from '../models/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projects: Project[] = [
    {
      id: 'techno-posters',
      title: 'Techno Posters',
      description: 'E-commerce website, selling unique gemstones. Giving energies, love, strength. From design to final website implementation.',
      services: ['UI/UX', 'Concept', 'Development', 'Branding'],
      client: 'L\'usine',
      websiteUrl: 'https://example.com',
      tags: 'WEB • DESIGN',
      thumbnail: 'projects/techno-posters/plana-1.jpg',
      images: [
        { url: 'projects/techno-posters/plana-2.jpg', name: 'Products' },
        { url: 'projects/techno-posters/plana-3.jpg', name: 'Product Detail' },
        { url: 'projects/techno-posters/plana-4.jpg', name: 'Cart' },
        { url: 'projects/techno-posters/plana-5.jpg', name: 'Checkout' },
        { url: 'projects/techno-posters/plana-6.jpg', name: 'Checkout' },
      ]
    },
    {
      id: 'halte-geneva',
      title: 'HALTE Geneva',
      description: 'Theatrical design and brochure creation for HALTE Geneva, showcasing their artistic performances and cultural events.',
      services: ['Theatrical Design', 'Brochure Design', 'Print Media'],
      client: 'Comédie de Genève',
      tags: 'THEATRAL • DESIGN • BROCHURE',
      thumbnail: 'projects/halte/cover.jpg',
      images: [
        { url: 'projects/halte/1.jpg', name: 'Products' },
        { url: 'projects/halte/2.jpg', name: 'Products' },
        { url: 'projects/halte/3.jpg', name: 'Products' },
        { url: 'projects/halte/4.jpg', name: 'Products' },
        { url: 'projects/halte/5.jpg', name: 'Products' }
      ]
    },
    {
      id: 'aeris',
      title: 'AERIS',
      description: 'E-commerce website, selling unique gemstones. Giving energies, love, strength. From design to final website implementation.',
      services: ['UI/UX', 'Concept', 'Development', 'Branding'],
      client: 'L\'usine',
      websiteUrl: 'https://example.com',
      tags: '3D • WEB • DESIGN • ANIMATION • MOTION GRAPHICS',
      thumbnail: 'projects/aeris/1.png',
      images: [
        { url: 'projects/aeris/1.jpg', name: 'Products' },
        { url: 'projects/aeris/2.jpg', name: 'Product Detail' },
        { url: 'projects/aeris/3.jpg', name: 'Cart' },
        { url: 'projects/aeris/4.jpg', name: 'Checkout' },
        { url: 'projects/aeris/5.jpg', name: 'Checkout' },
      ]
    },
  ];

  getAllProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | null {
    return this.projects.find(project => project.id === id) || null;
  }
} 