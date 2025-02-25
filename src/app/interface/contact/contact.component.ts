import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { finalize, interval, take, timer } from 'rxjs';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  // INTERNAL VARIABLES
  @ViewChild('warpCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private stars: any[] = [];
  private width!: number;
  private height!: number;
  private animationFrameId!: number;
  private devicePixelRatio = window.devicePixelRatio || 1;
  private currentSpeed: number = 0;
  private displayText: boolean = false;
  private ctxFill = 'rgba(0, 0, 0, 0)';
  private readonly characters = "wxyz0123456789!?@#$%&*><:;=";
  private starSystemGen = this.starSystemGenerator();
  public displayTexts: string[] = [];
  
  // CUSTOMIZATIONS
  private readonly TARGET_SPEED: number = 6;
  private readonly STARS_COUNT: number = 600;
  private readonly LINE_LENGTH: number = 2;
  private readonly TEXT_COUNT: number = 17;
  private readonly TEXTS: string[] = ["LET'S GET", "IN TOUCH!", "github", "hello@antidote.com", "artstation", "antidote.gems"];

  ngOnInit(): void {
    this.initStars();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.smoothSpeedIncrease();
  }

  // SCROLL ANIMATION: Speed up briefly the stars. 
  @HostListener('window:wheel', ['$event'])
  onWheel(): void {
    if (this.displayText === true) {
      this.currentSpeed += 1;

      const interval = setInterval(() => {
        if(this.currentSpeed > this.TARGET_SPEED) {
          this.currentSpeed -= 1;
        }
        else {
          clearInterval(interval)
        }
      }, 500);
    }
  }

  private startAnimation() {
    this.displayTexts = this.TEXTS.map(word => "".repeat(word.length));

    this.TEXTS.forEach((word, index) => {
      this.animateWord(word, index);
    });
  }

  private animateWord(word: string, index: number) {
    let textArray = word.split("");
    let randomTextArray = Array(word.length).fill("");

    // Delay each word animation dynamically (e.g., index * 1000ms means each word starts 1 sec apart)
    timer(index * 400).subscribe(() => {
      interval(100)
        .pipe(take(textArray.length + 5)) // Stops after full reveal
        .subscribe((tick) => {
          if (tick < textArray.length) {
            randomTextArray[tick] = textArray[tick]; // Reveal correct character
          }

          // Replace remaining characters with random ones
          for (let i = tick + 1; i < textArray.length; i++) {
            randomTextArray[i] = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
          }

          this.displayTexts[index] = randomTextArray.join("");
        });
    });
  }

  private smoothSpeedIncrease(): void {
    let highestSpeed = this.TARGET_SPEED * 10;
    let step = 0.2;
    let ascending = true;

    const speedInterval = setInterval(() => {
      if (this.currentSpeed < highestSpeed && ascending) {
        this.currentSpeed += step;
      } else if (this.currentSpeed > this.TARGET_SPEED) {
        this.ctxFill = 'rgba(0, 0, 0, 1)'
        ascending = false
        this.currentSpeed -= step;
      } else {
        this.currentSpeed = this.TARGET_SPEED;
        clearInterval(speedInterval);
        this.displayText = true;
        this.startAnimation();
      }
    }, 5);

    this.animate();
  }

  private *starSystemGenerator() {
    const prefixes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Omicron", "Sigma", "Omega"];
    const suffixes = ["Centauri", "Eridani", "Ceti", "Luyten", "Proxima", "Wolf", "Gliese", "Kepler", "TRAPPIST", "Andromeda"];

    while (true) {
      yield `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;

    this.width = window.innerWidth;
    this.height = window.innerHeight

    canvas.width = this.width * this.devicePixelRatio;
    canvas.height = this.height * this.devicePixelRatio;

    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

    this.initStars();
  }

  private initStars(): void {
    let textStarCount = 0;
    this.stars = Array.from({ length: this.STARS_COUNT }, () => {

      textStarCount++

      return { 
        x: Math.random() * this.width - this.width / 2, 
        y: Math.random() * this.height - this.height / 2, 
        z: Math.random() * this.width, 
        prevZ: 0, 
        text: textStarCount < this.TEXT_COUNT ? this.starSystemGen.next().value : null
      };
    });
  }

  private animate(): void {
    this.ctx.fillStyle = this.ctxFill;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.stars.forEach(star => {
      star.prevZ = star.z;
      star.z -= this.currentSpeed;

      if (star.z <= 0) {
        star.x = Math.random() * this.width - this.width / 2;
        star.y = Math.random() * this.height - this.height / 2;
        star.z = this.width;
        star.prevZ = this.width;
      }

      const sx = (star.x / star.z) * this.width + this.width / 2;
      const sy = (star.y / star.z) * this.height + this.height / 2;
      const px = (star.x / star.prevZ) * this.width + this.width / 2;
      const py = (star.y / star.prevZ) * this.height + this.height / 2;
      
      // Compute direction vector
      const dx = sx - px;
      const dy = sy - py;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / distance;
      const uy = dy / distance;
      const ex = sx + ux * this.LINE_LENGTH;
      const ey = sy + uy * this.LINE_LENGTH;
      
      const colorValue = Math.floor(255 * (1.2 - star.z / this.width));
      const rgbMix = `rgb(${colorValue}, ${colorValue}, ${colorValue})`
      this.ctx.strokeStyle = rgbMix;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(ex, ey);
      this.ctx.stroke();
      
      // Draw text following only selected stars
      if (star.text && this.displayText) {
        this.ctx.fillStyle = rgbMix;
        this.ctx.font = `${8 * this.devicePixelRatio}px JetBrains-ExtraLight`;
        this.ctx.fillText(star.text, sx + 15, sy + 4);
        
        // Draw square around star
        this.ctx.strokeStyle = '#343434';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(sx - 7, sy - 7, 14, 14);
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}
