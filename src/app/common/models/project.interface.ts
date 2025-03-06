export interface Project {
  id: string;
  title: string;
  description: string;
  services: string[];
  client: string;
  websiteUrl?: string;
  thumbnail?: string;
  images: { url: string; name: string }[];
  tags: string;
} 