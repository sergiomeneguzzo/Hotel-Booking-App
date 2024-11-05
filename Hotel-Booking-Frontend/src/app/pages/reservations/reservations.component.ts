import { Component } from '@angular/core';
import { Booking } from '../../interfaces/booking.entity';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent {
  baseUrl: string = 'http://localhost:3000/uploads';
  bookings: Booking[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookingsByUser().subscribe(
      (data) => {
        this.bookings = data;
        console.log('bookings:', data);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Unable to load bookings. Please try again later.';
        this.loading = false;
      }
    );
  }

  getImageUrl(imageName: string): string {
    return `${this.baseUrl}/${imageName}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'canceled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
