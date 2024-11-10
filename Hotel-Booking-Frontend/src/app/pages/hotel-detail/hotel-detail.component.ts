import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  baseUrl: string = 'https://res.cloudinary.com';
  hotel: Hotel | undefined;
  today: Date = new Date();
  unavailableDates: { start: Date; end: Date }[] = [];
  isDatepickerDisabled: boolean = false;
  bookingForm: FormGroup;
  hotelId: string | null = null;
  minEndDate: Date | null = null;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private bookingService: BookingService,
    private notify: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hotelId = this.route.snapshot.paramMap.get('id');
    if (this.hotelId) {
      this.hotelService.getHotelById(this.hotelId).subscribe((hotel) => {
        this.hotel = hotel;
        this.isLoading = false;
        this.checkAvailability();
      });
    }

    //To set minEndDate to the next day of the selected startDate
    this.bookingForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      if (startDate) {
        this.minEndDate = new Date(startDate);
        this.minEndDate.setDate(this.minEndDate.getDate() + 1);
        this.bookingForm.get('endDate')?.setValue(null);
        this.bookingForm
          .get('endDate')
          ?.setValidators([
            Validators.required,
            Validators.min(this.minEndDate.getTime()),
          ]);
        this.bookingForm.get('endDate')?.updateValueAndValidity();
      }
    });
  }

  checkAvailability() {
    this.isLoading = true;
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.bookingService.getUnavailableDates(hotelId).subscribe(
        (unavailableDates) => {
          this.unavailableDates = unavailableDates;
          this.checkIfDateIsUnavailable(
            this.bookingForm.get('startDate')?.value
          );
          this.checkIfDateIsUnavailable(this.bookingForm.get('endDate')?.value);
          console.log('Unavailable dates:', this.unavailableDates);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching unavailable dates:', error);
        }
      );
    }
  }

  ngAfterViewInit() {
    this.checkIfDateIsUnavailable = (d: Date | null): boolean => {
      if (!d) {
        return true;
      }
      console.log('d:', d);
      this.hotelId = this.route.snapshot.paramMap.get('id');

      if (!this.hotelId) {
        console.warn('Hotel ID is missing');
        return false;
      }

      this.bookingService.getUnavailableDates(this.hotelId).subscribe(
        (unavailableDates) => {
          this.isLoading = false;
          if (!unavailableDates || !Array.isArray(unavailableDates)) {
            return false;
          }

          const isUnavailable = unavailableDates.some((date) => {
            const currentDate = new Date(d!);
            return (
              currentDate >= new Date(date.start) &&
              currentDate <= new Date(date.end)
            );
          });

          console.log('UNAVAILABLE' + isUnavailable);
          return isUnavailable;
        },
        (error) => {
          console.error('Error fetching unavailable dates:', error);
          return false;
        }
      );

      return true;
    };
  }

  checkIfDateIsUnavailable(date: Date | null): boolean {
    if (!date) {
      return false;
    }

    return this.unavailableDates.some((unavailableDate) => {
      const currentDate = new Date(date);
      const start = new Date(unavailableDate.start);
      const end = new Date(unavailableDate.end);

      return currentDate >= start && currentDate <= end;
    });
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

          this.router.navigate(['/bookings']);
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
