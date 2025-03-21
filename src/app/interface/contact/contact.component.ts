import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { ScramblerTextComponent } from '../../widgets/scrambler-text/scrambler-text.component';

const STAR_COLORS = [
  [142, 116, 240],
  [123, 107, 190],
  [55, 50, 79],
  [222, 220, 259]
];

@Component({
  selector: 'app-contact',
  imports: [ScramblerTextComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('warpCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private stars: any[] = [];
  private width = window.innerWidth;
  private height = window.innerHeight;
  private animationFrameId!: number;
  private devicePixelRatio = window.devicePixelRatio || 1;
  private currentSpeed = 0;
  private ctxFill = 'rgba(0, 0, 0, 0)';
  private starSystemGen = this.starSystemGenerator();

  public displayText = false;

  // CUSTOMIZATION CONSTANTS
  private readonly TARGET_SPEED = 6;
  private readonly STARS_COUNT = this.width * 0.8;
  private readonly LINE_LENGTH = 2;
  private readonly TEXT_COUNT = 17;

  // Interval and timeout references for cleanup
  private smoothSpeedIntervalId: any;

  ngOnInit(): void {
    this.initStars();
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.smoothSpeedIncrease();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    clearInterval(this.smoothSpeedIntervalId);
  }

  // Using HostListener to handle window resize events
  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  /**
   * Smoothly increases the star speed, then decreases it to the target speed.
   * Uses a short interval to gradually change the current speed.
   */
  private smoothSpeedIncrease(): void {
    const highestSpeed = this.TARGET_SPEED * 10;
    const step = 0.2;
    let ascending = true;

    this.smoothSpeedIntervalId = setInterval(() => {
      if (ascending && this.currentSpeed < highestSpeed) {
        this.currentSpeed += step;
      } else if (this.currentSpeed > this.TARGET_SPEED) {
        this.ctxFill = 'rgba(0, 0, 0, 1)';
        ascending = false;
        this.currentSpeed -= step;
      } else {
        this.currentSpeed = this.TARGET_SPEED;
        clearInterval(this.smoothSpeedIntervalId);
        this.displayText = true;
      }
    }, 5);

    this.animate();
  }

  /**
   * A generator that infinitely yields randomized star system names.
   */
  private *starSystemGenerator(): Generator<string, void, unknown> {
    const prefixes = [
      'Alpha',
      'Beta',
      'Gamma',
      'Delta',
      'Epsilon',
      'Zeta',
      'Theta',
      'Omicron',
      'Sigma',
      'Omega'
    ];
    const suffixes = [
      'Centauri',
      'Eridani',
      'Ceti',
      'Luyten',
      'Proxima',
      'Wolf',
      'Gliese',
      'Kepler',
      'TRAPPIST',
      'Andromeda'
    ];
    while (true) {
      yield `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }
  }

  /**
   * Sets up the canvas dimensions based on the window size.
   * Resets the transformation and scales according to the device pixel ratio.
   */
  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    canvas.width = this.width * this.devicePixelRatio;
    canvas.height = this.height * this.devicePixelRatio;

    // Reset transform before scaling
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

    this.initStars();
  }

  /**
   * Initializes the stars array.
   * Some stars get an extra text label using the star system generator.
   */
  private initStars(): void {
    let textStarCount = 0;
    this.stars = new Array(this.STARS_COUNT).fill(null).map(() => {
      textStarCount++;
      return {
        x: Math.random() * this.width - this.width / 2,
        y: Math.random() * this.height - this.height / 2,
        z: Math.random() * this.width,
        prevZ: 0,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        text: textStarCount < this.TEXT_COUNT ? this.starSystemGen.next().value : null
      };
    });
  }

  /**
   * Animation loop.
   * Clears the canvas, updates each star's position and draws it.
   * Uses precomputed half-width/height to reduce repeated calculations.
   */
  private animate(): void {
    this.ctx.fillStyle = this.ctxFill;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    this.stars.forEach(star => {
      star.prevZ = star.z;
      star.z -= this.currentSpeed;

      if (star.z <= 0) {
        star.x = Math.random() * this.width - halfWidth;
        star.y = Math.random() * this.height - halfHeight;
        star.z = this.width;
        star.prevZ = this.width;
      }

      const sx = (star.x / star.z) * this.width + halfWidth;
      const sy = (star.y / star.z) * this.height + halfHeight;
      const px = (star.x / star.prevZ) * this.width + halfWidth;
      const py = (star.y / star.prevZ) * this.height + halfHeight;
      const dx = sx - px;
      const dy = sy - py;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1; // prevent division by zero
      const ux = dx / distance;
      const uy = dy / distance;
      const ex = sx + ux * this.LINE_LENGTH;
      const ey = sy + uy * this.LINE_LENGTH;

      // Calculate color intensity based on depth
      const factor = 1.1 - star.z / this.width;
      const rgbMix = `rgb(${Math.floor(star.color[0] * factor)}, ${Math.floor(
        star.color[1] * factor * 1.2
      )}, ${Math.floor(star.color[2] * factor)})`;

      this.ctx.strokeStyle = rgbMix;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(ex, ey);
      this.ctx.stroke();

      if (star.text && this.displayText) {
        this.ctx.strokeStyle = '#343434';
        this.ctx.fillStyle = '#343434';
        this.ctx.font = `${8 * this.devicePixelRatio}px JetBrains-ExtraLight`;
        this.ctx.fillText(star.text, sx + 15, sy + 4);
        this.ctx.strokeRect(sx - 7, sy - 7, 14, 14);
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}
