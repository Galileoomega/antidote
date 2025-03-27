import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { interval, take, timer } from 'rxjs';

@Component({
  selector: 'app-scrambler-text',
  imports: [],
  templateUrl: './scrambler-text.component.html'
})
export class ScramblerTextComponent implements AfterViewInit, OnChanges {
  @Input() text: string = "";
  @Input() duration: number = 20;
  @Input() delay: number = 10;
  @Input() event: boolean = false;
  @Input() singleExecution: boolean = true;

  public finalText: string = "";
  private readonly characters = "wxyz0123456789!?@#$%&*><:;=";
  private hasAnimated: boolean = false;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.event == true) {
      this.animateWord(this.text);
    }
  }

  ngOnChanges(): void {
    if (this.event == true) {
      this.animateWord(this.text);
    }
  }

  private animateWord(word: string) {
    if(this.singleExecution && this.hasAnimated) {
      return;
    }

    const textArray: string[] = word.split("");
    let randomTextArray: string[] = Array(word.length).fill("");
    this.hasAnimated = true;

    timer(this.delay).subscribe(() => {
      interval(this.duration)
        .pipe(take(textArray.length))
        .subscribe((tick) => {
          
          // Reveal correct character
          if (tick < textArray.length) {
            randomTextArray[tick] = textArray[tick];
          }

          // Replace remaining characters with random ones
          for (let i = tick + 1; i < textArray.length; i++) {
            if (textArray[i] == '\n') {
              randomTextArray[i] = '\n';
            }
            else {
              randomTextArray[i] = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            }
          }

          this.finalText = randomTextArray.join("");
        });
    });
  }
}
