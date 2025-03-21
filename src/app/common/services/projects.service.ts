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
      description: 'Theatrical design and brochure creation for HALTE Geneva, showcasing their artistic performances and cultural events.',
      services: ['Theatrical Design', 'Brochure Design', 'Print Media'],
      client: 'Comédie de Genève',
      tags: 'THEATRAL • DESIGN • BROCHURE',
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
      description: 'E-commerce website, selling unique gemstones. Giving energies, love, strength. From design to final website implementation.',
      services: ['UI/UX', 'Concept', 'Development', 'Branding'],
      client: 'L\'usine',
      websiteUrl: 'https://example.com',
      tags: '3D • WEB • DESIGN • ANIMATION • MOTION GRAPHICS',
      thumbnail: 'projects/aeris/1.jpg',
      medias: [
        { type: 'video', url: 'projects/aeris/2.mp4', name: 'Products' },
        { type: 'video', url: 'projects/aeris/3.mp4', name: 'Cart' },
        { type: 'image', url: 'projects/aeris/2.jpg', name: 'Product Detail' },
        { type: 'image', url: 'projects/aeris/4.jpg', name: 'Checkout' },
        { type: 'image', url: 'projects/aeris/5.jpg', name: 'Checkout' },
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
      thumbnail: 'projects/aeris/1.jpg',
      medias: [
        { type: 'video', url: 'projects/aeris/2.mp4', name: 'Products' },
        { type: 'video', url: 'projects/aeris/3.mp4', name: 'Cart' }
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