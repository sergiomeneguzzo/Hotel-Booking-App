import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../interfaces/hotel.entity';
import { APIURL } from '../enviroments/apiurl';
import { Amenity } from '../interfaces/amenities.entity';
import { HotelType } from '../interfaces/hotel-type.entity';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  constructor(private http: HttpClient) {}

  createHotel(hotelData: FormData): Observable<any> {
    return this.http.post(`${APIURL}/api/hotels`, hotelData);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    return this.http.post(
      'https://api.cloudinary.com/v1_1/dtizmgqqa/image/upload',
      formData
    );
  }

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${APIURL}/api/hotels`);
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${APIURL}/api/hotels/${id}`);
  }

  getAmenities(): Observable<Amenity[]> {
    return this.http.get<Amenity[]>(`${APIURL}/api/amenities`);
  }

  getHotelTypes(): Observable<HotelType[]> {
    return this.http.get<HotelType[]>(`${APIURL}/api/hotel-types`);
  }
}
