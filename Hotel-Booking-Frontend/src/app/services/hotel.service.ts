import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../interfaces/hotel.entity';
import { APIURL } from '../enviroments/apiurl';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  constructor(private http: HttpClient) {}

  createHotel(hotelData: FormData): Observable<any> {
    return this.http.post(`${APIURL}/api/hotels`, hotelData);
  }
}
