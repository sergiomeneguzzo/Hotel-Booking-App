import { Component } from '@angular/core';
import { Booking } from '../../interfaces/booking.entity';
import { BookingService } from '../../services/booking.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent {
  //baseUrl: string = 'https://tropical-api.onrender.com/uploads';
  baseUrl: string = 'https://res.cloudinary.com';
  bookings: Booking[] = [];
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private bookingService: BookingService,
    private notify: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getBookingsByUser().subscribe(
      (data) => {
        this.isLoading = false;
        this.bookings = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load bookings. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  openDeleteDialog(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteBooking(id);
      }
    });
  }

  deleteBooking(bookingId: string): void {
    this.isLoading = true;
    console.log(bookingId);
    this.bookingService.deleteBooking(bookingId).subscribe(
      () => {
        this.bookings = this.bookings.filter(
          (booking) => booking.id !== bookingId
        );
        this.isLoading = false;
        this.notify.successMessage('Booking deleted successfully.');
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage =
          'Failed to delete the booking. Please try again later.';
        console.error('Error deleting booking:', error);
        this.notify.errorMessage('Failed to delete the booking.');
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
