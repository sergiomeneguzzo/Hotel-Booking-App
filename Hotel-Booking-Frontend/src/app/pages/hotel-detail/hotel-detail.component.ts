import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hotel } from '../../interfaces/hotel.entity';
import { HotelService } from '../../services/hotel.service';
import { Amenity } from '../../interfaces/amenities.entity';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BookingService } from '../../services/booking.service';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss'],
})
export class HotelDetailComponent implements OnInit {
  baseUrl: string = 'https://res.cloudinary.com';
  hotel: Hotel | undefined;
  today: Date = new Date();
  isDatepickerDisabled: boolean = false;
  bookingForm: FormGroup;
  hotelId: string | null = null;
  minEndDate: Date | null = null;

  route = inject(ActivatedRoute);
  unavailableDates$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    startWith(null),
    switchMap((id) => {
      if (!id) {
        return of([]);
      }
      return this.bookingService.getUnavailableDates(id!);
    }),
    tap((_) => console.log('test'))
  );

  checkUnavailable$ = this.unavailableDates$.pipe(
    map((unavailableDates) => {
      return (d: Date | null) => {
        if (!d) {
          return false;
        }

        if (!unavailableDates || !Array.isArray(unavailableDates)) {
          return true;
        }

        const isUnavailable = unavailableDates.some((date) => {
          const currentDate = new Date(d!);
          return (
            currentDate >= new Date(date.start) &&
            currentDate <= new Date(date.end)
          );
        });

        console.log('UNAVAILABLE' + isUnavailable);
        return !isUnavailable;
      };
    })
  );

  isLoading = false;

  constructor(
    private hotelService: HotelService,
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
    this.isLoading = false;
    this.hotelId = this.route.snapshot.paramMap.get('id');
    if (this.hotelId) {
      this.hotelService.getHotelById(this.hotelId).subscribe((hotel) => {
        this.hotel = hotel;
        this.isLoading = false;
        this.checkAvailability();
      });
    }

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
          console.log('Unavailable dates:', unavailableDates);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching unavailable dates:', error);
        }
      );
    }
  }

  checkIfDateIsUnavailable(
    unavailableDates: { start: Date; end: Date }[] | null
  ) {
    return (d: Date | null) => {
      if (!d) {
        return false;
      }

      if (!unavailableDates || !Array.isArray(unavailableDates)) {
        return true;
      }

      const isUnavailable = unavailableDates.some((date) => {
        const currentDate = new Date(d!);
        return (
          currentDate >= new Date(date.start) &&
          currentDate <= new Date(date.end)
        );
      });

      console.log('UNAVAILABLE' + isUnavailable);
      return !isUnavailable;
    };
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
