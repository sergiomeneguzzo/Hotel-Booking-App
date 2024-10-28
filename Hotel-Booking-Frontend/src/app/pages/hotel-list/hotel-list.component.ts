import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Hotel } from '../../interfaces/hotel.entity';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss',
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private HotelSrv: HotelService
  ) {
    this.filterForm = this.fb.group({
      searchQuery: [''],
      maxGuests: [null],
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

    this.filterForm.valueChanges.subscribe(() => this.filterHotels());
  }

  onPriceRangeChange(event: any) {
    const priceRange = this.filterForm.get('priceRange');
    if (priceRange) {
      const min = priceRange.get('min')?.value;
      const max = priceRange.get('max')?.value;

      priceRange.patchValue({ min, max });
      this.filterHotels();
    }
  }

  filterHotels() {
    const { searchQuery, maxGuests, priceRange } = this.filterForm.value;
    this.filteredHotels = this.hotels.filter((hotel) => {
      const matchesSearch = hotel.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGuests = maxGuests ? hotel.maxGuests >= maxGuests : true;
      const matchesPrice =
        hotel.pricePerNight >= priceRange.min &&
        hotel.pricePerNight <= priceRange.max;
      return matchesSearch && matchesGuests && matchesPrice;
    });
  }
}
