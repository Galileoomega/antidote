import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-nebula',
  imports: [],
  templateUrl: './nebula.component.html',
  styleUrl: './nebula.component.scss'
})
export class NebulaComponent {
  private mouseX: number = 0;
  private mouseY: number = 0;

  private mouseOffsetX: number = 0;
  private mouseOffsetY: number = 0;

  @HostListener('document:mousemove', ['$event'])
  onMouseMoveEvent(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    this.calculateMouseOffsetFromCenter();
  }

  private calculateMouseOffsetFromCenter(): void {
    // Get the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate the mouse offset from the center
    const mouseOffsetX = this.mouseX - centerX;
    const mouseOffsetY = this.mouseY - centerY;

    // Calculate the percentage of the offset relative to the screen dimensions
    this.mouseOffsetX = (mouseOffsetX / centerX) * 100;
    this.mouseOffsetY = (mouseOffsetY / centerY) * 100;
  }

  public moveByMouseOffset(bodyId: string, speedFactor: number): { [key: string]: string } {
    // Define base values for calculations
    const offsetX = this.mouseOffsetX / 2 * speedFactor;
    const offsetY = this.mouseOffsetY / 2 * speedFactor;
  
    // Create a default return object
    const styles: { [key: string]: string } = {};
  
    styles['transform'] = `translate(-50%, -50%) perspective(500px) rotateX(${(this.mouseOffsetY * -1) * 0.5}deg) rotateY(${this.mouseOffsetX * 0.5}deg)`;
  
    // Return the computed styles
    return styles;
  }  
}
