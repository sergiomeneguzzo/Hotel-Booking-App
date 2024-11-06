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
  baseUrl: string = 'https://tropical-api.onrender.com/uploads';
  hotel: Hotel | undefined;
  today: Date = new Date();
  unavailableDates: { start: Date; end: Date }[] = [];
  isDatepickerDisabled: boolean = false;
  bookingForm: FormGroup;
  hotelId: string | null = null;

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
    this.hotelId = this.route.snapshot.paramMap.get('id');
    if (this.hotelId) {
      this.hotelService.getHotelById(this.hotelId).subscribe((hotel) => {
        this.hotel = hotel;
        this.isLoading = false;
        this.checkAvailability();
      });
    }

    this.bookingForm.get('startDate')?.valueChanges.subscribe(() => {
      this.onStartDateChange();
    });

    this.bookingForm.valueChanges.subscribe(() => {});
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
            console.log('ERRORE PORCO DIO');
            return false; // Return false if unavailableDates is not in the correct format
          }

          // Check if the given date falls within any of the unavailable date ranges
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

  allowAllDates(date: Date | null): boolean {
    return true;
  }

  checkIfDateIsUnavailable(date: Date | null): boolean {
    if (!date) {
      return false;
    }

    // Check if the date falls within any of the unavailable date ranges
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
