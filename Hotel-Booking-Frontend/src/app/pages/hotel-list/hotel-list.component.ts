import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Hotel } from '../../interfaces/hotel.entity';
import { HotelService } from '../../services/hotel.service';
import { Amenity } from '../../interfaces/amenities.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss',
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  services: Amenity[] = [];
  filteredHotels: Hotel[] = [];
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private HotelSrv: HotelService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      searchQuery: [''],
      maxGuests: [null],
      services: [[]],
      priceRange: this.fb.group({
        min: [0],
        max: [1000],
      }),
    });
  }

  ngOnInit(): void {
    this.HotelSrv.getHotels().subscribe((hotels) => {
      this.hotels = hotels;
      this.filteredHotels = hotels;
    });

    this.HotelSrv.getAmenities().subscribe((services) => {
      this.services = services;
    });

    this.filterForm.valueChanges.subscribe(() => this.filterHotels());
  }

  filterHotels() {
    const { searchQuery, maxGuests, services, priceRange } =
      this.filterForm.value;
    this.filteredHotels = this.hotels.filter((hotel) => {
      const matchesSearch = hotel.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGuests = maxGuests ? hotel.maxGuests >= maxGuests : true;
      const matchesPrice =
        hotel.pricePerNight >= priceRange.min &&
        hotel.pricePerNight <= priceRange.max;

      const matchesServices =
        services.length > 0
          ? services.every((selectedService: string) =>
              hotel.amenities.some((amenity: string | Amenity) =>
                typeof amenity === 'string'
                  ? amenity === selectedService
                  : amenity.name === selectedService
              )
            )
          : true;

      return matchesSearch && matchesGuests && matchesPrice && matchesServices;
    });
  }

  clearFilters() {
    this.filterForm.reset({
      searchQuery: '',
      maxGuests: null,
      services: [],
      priceRange: {
        min: 0,
        max: 1000,
      },
    });
    this.filteredHotels = this.hotels;
  }

  goToHotelDetail(id: string) {
    this.router.navigate(['/hotels', id]);
  }
}
