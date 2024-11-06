import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Hotel } from '../../interfaces/hotel.entity';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss',
})
export class HotelCardComponent {
  baseUrl: string = 'https://tropical-api.onrender.com/uploads';

  @Input() hotel!: Hotel;
  constructor(private router: Router) {}

  getImageUrl(imageName: string): string {
    return `${this.baseUrl}/${imageName}`;
  }
}
