import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hotel } from '../../interfaces/hotel.entity';
import { HotelService } from '../../services/hotel.service';
import { Amenity } from '../../interfaces/amenities.entity';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.scss',
})
export class HotelDetailComponent {
  baseUrl: string = 'http://localhost:3000/uploads';
  hotel: Hotel | undefined;
  startDate: Date | null = null;
  endDate: Date | null = null;
  today: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelById(hotelId).subscribe((hotel) => {
        this.hotel = hotel;
      });
    }
  }

  isAmenity(amenity: string | Amenity): amenity is Amenity {
    return (amenity as Amenity)._id !== undefined;
  }

  onStartDateChange() {
    if (this.endDate && this.startDate && this.endDate < this.startDate) {
      this.endDate = null;
    }
  }

  checkAvailability() {
    if (this.startDate && this.endDate) {
      const formattedStartDate = this.datePipe.transform(
        this.startDate,
        'dd/MM/yyyy'
      );
      const formattedEndDate = this.datePipe.transform(
        this.endDate,
        'dd/MM/yyyy'
      );
      console.log(
        'Checking availability from',
        formattedStartDate,
        'to',
        formattedEndDate
      );
    } else {
      console.log('Please select both check-in and check-out dates.');
    }
  }

  bookHotel() {
    // Logic to book the hotel with selected dates
    if (this.startDate && this.endDate) {
      alert(`Booking confirmed from ${this.startDate} to ${this.endDate}!`);
    } else {
      alert('Please select both check-in and check-out dates.');
    }
  }

  getImageUrl(imageName: string): string {
    return `${this.baseUrl}/${imageName}`;
  }
}
