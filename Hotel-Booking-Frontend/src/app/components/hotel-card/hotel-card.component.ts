import { Component, Input } from '@angular/core';
import { Hotel } from '../../interfaces/hotel.entity';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss',
})
export class HotelCardComponent {
  baseUrl: string = 'http://localhost:3000/uploads';

  @Input() hotel!: Hotel;

  getImageUrl(imageName: string): string {
    return `${this.baseUrl}/${imageName}`;
  }
}
