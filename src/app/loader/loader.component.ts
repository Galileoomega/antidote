import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  public showLoader: string = 'unset';

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showLoader = 'hide'
    }, 1700);
  }
}
