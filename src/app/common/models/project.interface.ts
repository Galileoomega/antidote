export interface Project {
  id: string;
  title: string;
  description: string;
  services: string[];
  client: string;
  websiteUrl?: string;
  images: { url: string; name: string }[];
  previewImage: string;
  tags: string;
} 