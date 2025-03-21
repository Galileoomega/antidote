import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-img-loader',
  imports: [],
  templateUrl: './img-loader.component.html',
  styleUrl: './img-loader.component.scss'
})
export class ImgLoaderComponent {
  // Input for the original (full resolution) image.
  @Input() src!: string;
  // Input to specify the number of lower resolution images available.
  // For example, if resolutions = 2, the chain will be:
  // myimage-res1.webp, myimage-res2.webp, myimage.webp
  @Input() resolutions: number = 2;

  currentSrc!: string;
  isFinalLoaded = false;
  imageChain: string[] = [];

  ngOnInit(): void {
    this.setupImageChain();
    this.loadImagesProgressively();
  }

  /**
   * Build the image chain by generating lower resolution URLs using a naming pattern.
   * The naming convention is: base-res{n}.extension, for n = 1..resolutions, and then the original.
   */
  setupImageChain(): void {
    const extensionIndex = this.src.lastIndexOf('.');
    const base = this.src.substring(0, extensionIndex);
    const extension = this.src.substring(extensionIndex);
    
    // Generate lower resolution image URLs.
    for (let i = 1; i <= this.resolutions; i++) {
      this.imageChain.push(`${base}-res${i}${extension}`);
    }
    // Finally, add the original full resolution image.
    this.imageChain.push(this.src);
  }

  /**
   * Load each image in the chain sequentially. As soon as one image is loaded,
   * update the displayed image and move on to load the next.
   */
  loadImagesProgressively(index: number = 0): void {
    if (index >= this.imageChain.length) {
      return;
    }
    const imgSrc = this.imageChain[index];
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      // Update current image source.
      this.currentSrc = imgSrc;
      // If this is the final image (original full resolution), mark it as loaded.
      if (index === this.imageChain.length - 1) {
        this.isFinalLoaded = true;
      }
      // Load the next image in the chain.
      this.loadImagesProgressively(index + 1);
    };
    // If the image fails to load, simply skip to the next image.
    img.onerror = () => {
      this.loadImagesProgressively(index + 1);
    };
  }

  handleLoad(): void {
    // Additional on-load logic can be placed here.
  }
}
