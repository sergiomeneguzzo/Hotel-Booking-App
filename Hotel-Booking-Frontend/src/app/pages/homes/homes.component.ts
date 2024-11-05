import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Amenity } from '../../interfaces/amenities.entity';
import { Hotel } from '../../interfaces/hotel.entity';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-homes',
  templateUrl: './homes.component.html',
  styleUrl: './homes.component.scss',
})
export class HomesComponent {
  hotels: Hotel[] = [];
  services: Amenity[] = [];
  filteredHotels: Hotel[] = [];
  filterForm: FormGroup;
  showFilters = false;
  isLoading = false;
  private readonly specificHotelTypeId = '6720b174bc476a5500822715';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private hotelService: HotelService,
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

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hotelService.getHotels().subscribe((hotels) => {
      this.hotels = hotels.filter(
        (hotel) => hotel.hotelTypeId?._id === this.specificHotelTypeId
      );
      this.isLoading = false;
      this.filteredHotels = this.hotels;
    });

    this.hotelService.getAmenities().subscribe((services) => {
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
