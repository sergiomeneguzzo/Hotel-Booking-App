import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hotel } from '../../interfaces/hotel.entity';
import { HotelService } from '../../services/hotel.service';
import { Amenity } from '../../interfaces/amenities.entity';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BookingService } from '../../services/booking.service';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss'],
})
export class HotelDetailComponent implements OnInit {
  baseUrl: string = 'http://localhost:3000/uploads';
  hotel: Hotel | undefined;
  today: Date = new Date();
  unavailableDates: { start: string; end: string }[] = [];
  isDatepickerDisabled: boolean = false;
  bookingForm: FormGroup;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private bookingService: BookingService,
    private notify: NotificationService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelById(hotelId).subscribe((hotel) => {
        this.hotel = hotel;
        this.isLoading = false;
        this.checkAvailability();
      });
    }

    this.bookingForm.get('startDate')?.valueChanges.subscribe(() => {
      this.onStartDateChange();
    });

    this.bookingForm.valueChanges.subscribe(() => {
      this.checkIfDatesAreAvailable();
    });
  }

  isAmenity(amenity: string | Amenity): amenity is Amenity {
    return (amenity as Amenity)._id !== undefined;
  }

  onStartDateChange() {
    const startDate = this.bookingForm.get('startDate')?.value;
    const endDate = this.bookingForm.get('endDate')?.value;
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      this.bookingForm.get('endDate')?.reset();
    }
  }

  checkAvailability() {
    this.isLoading = true;
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.bookingService.getUnavailableDates(hotelId).subscribe(
        (unavailableDates) => {
          this.isLoading = false;
          this.unavailableDates = unavailableDates;
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching unavailable dates:', error);
        }
      );
    }
  }

  checkIfDatesAreAvailable() {
    const startDate = this.bookingForm.get('startDate')?.value;
    const endDate = this.bookingForm.get('endDate')?.value;
    const isUnavailable = this.unavailableDates.some(
      (date) =>
        (startDate &&
          new Date(date.start) <= new Date(startDate) &&
          new Date(date.end) >= new Date(startDate)) ||
        (endDate &&
          new Date(date.start) <= new Date(endDate) &&
          new Date(date.end) >= new Date(endDate))
    );
    if (isUnavailable) {
      this.notify.errorMessage('Selected dates are not available');
      this.isDatepickerDisabled = true;
    } else {
      this.isDatepickerDisabled = false;
    }
  }

  bookHotel() {
    this.isLoading = true;
    if (this.bookingForm.valid) {
      const { startDate, endDate, numberOfGuests } = this.bookingForm.value;
      const bookingDetails = {
        hotelId: this.hotel?._id,
        checkInDate: startDate,
        checkOutDate: endDate,
        guests: numberOfGuests,
      };

      this.bookingService.createBooking(bookingDetails).subscribe(
        (response) => {
          this.isLoading = false;
          this.notify.successMessage('Booking confirmed!');
          this.bookingForm.reset();
        },
        (error) => {
          this.isLoading = false;
          console.error('Error creating booking:', error);
          this.notify.errorMessage(
            'Failed to create booking. Please try again'
          );
        }
      );
    } else {
      this.isLoading = false;
      this.notify.warningMessage('Please fill all required fields.');
    }
  }

  getImageUrl(imageName: string): string {
    return `${this.baseUrl}/${imageName}`;
  }
}
