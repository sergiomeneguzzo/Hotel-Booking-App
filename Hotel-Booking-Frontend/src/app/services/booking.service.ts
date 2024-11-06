import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIURL } from '../enviroments/apiurl';
import { Booking } from '../interfaces/booking.entity';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${APIURL}/api/booking`, bookingData);
  }

  getUnavailableDates(
    hotelId: string
  ): Observable<{ start: Date; end: Date }[]> {
    return this.http.get<{ start: Date; end: Date }[]>(
      `${APIURL}/api/booking/unavailable-dates/${hotelId}`
    );
  }

  getBookingsByUser(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${APIURL}/api/booking/user`);
  }
}
