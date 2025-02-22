import { AfterViewInit, Component, Input } from '@angular/core';
import { interval, take, timer } from 'rxjs';

@Component({
  selector: 'app-scrambler-text',
  imports: [],
  templateUrl: './scrambler-text.component.html'
})
export class ScramblerTextComponent implements AfterViewInit {
  @Input() text: string = "";
  @Input() duration: number = 20;
  @Input() delay: number = 10;

  public finalText: string = "";
  private readonly characters = "wxyz0123456789!?@#$%&*><:;=";

  constructor() { }

  ngAfterViewInit(): void {
    this.animateWord(this.text);
  }

  private animateWord(word: string) {
    let textArray = word.split("");
    let randomTextArray = Array(word.length).fill("");

    timer(this.delay).subscribe(() => {
      interval(this.duration)
        .pipe(take(textArray.length + 5)) // Stops after full reveal
        .subscribe((tick) => {
          if (tick < textArray.length) {
            randomTextArray[tick] = textArray[tick]; // Reveal correct character
          }

          // Replace remaining characters with random ones
          for (let i = tick + 1; i < textArray.length; i++) {
            randomTextArray[i] = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
          }

          this.finalText = randomTextArray.join("");
        });
    });
  }
}
