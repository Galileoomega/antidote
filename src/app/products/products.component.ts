import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  public extensions: Array<any> = [
    {
      logoPath: 'icons/antidote-logo-gems.svg',
      description: 'Shop your favorite gems',
      url: 'https://google.com',
      color: '#724DDA'
    },
    {
      logoPath: 'icons/antidote-logo-dev.svg',
      description: 'Get your own e-commerce webiste.',
      url: 'https://google.com',
      color: '#DA4D62'
    }
  ];
}
