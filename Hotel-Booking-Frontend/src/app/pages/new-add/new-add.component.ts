import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hotel } from '../../interfaces/hotel.entity';
import { HotelService } from '../../services/hotel.service';
import { NotificationService } from '../../services/notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Amenity } from '../../interfaces/amenities.entity';
import { HotelType } from '../../interfaces/hotel-type.entity';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-add',
  templateUrl: './new-add.component.html',
  styleUrl: './new-add.component.scss',
})
export class NewAddComponent {
  hotelForm!: FormGroup;
  selectedFiles: File[] = [];
  fileNames: string = '';
  services: Amenity[] = [];
  hotelTypes: HotelType[] = [];
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private hotelService: HotelService,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.hotelForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      maxGuests: [null, [Validators.required, Validators.min(1)]],
      amenities: [[], Validators.required],
      hotelType: [null, Validators.required],
      photos: [null],
      pricePerNight: [null, [Validators.required, Validators.min(0)]],
    });

    this.hotelService.getAmenities().subscribe((data: Amenity[]) => {
      this.services = data;
    });

    this.hotelService.getHotelTypes().subscribe((data: HotelType[]) => {
      this.hotelTypes = data;
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      this.selectedFiles = this.selectedFiles.concat(newFiles);

      const names = this.selectedFiles.map((file) => file.name);
      this.fileNames = names.join(', ');
    }
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      const amenitiesArray = this.hotelForm.value.amenities;

      const formData = new FormData();
      formData.append('name', this.hotelForm.value.name);
      formData.append('description', this.hotelForm.value.description);
      formData.append('location', this.hotelForm.value.location);
      formData.append('maxGuests', this.hotelForm.value.maxGuests.toString());
      formData.append('hotelType', this.hotelForm.value.hotelType);
      formData.append('amenities', JSON.stringify(amenitiesArray));
      formData.append(
        'pricePerNight',
        this.hotelForm.value.pricePerNight.toString()
      );

      const uploadPromises = this.selectedFiles.map((file) =>
        this.hotelService.uploadFile(file).toPromise()
      );

      const uploadedFiles = await Promise.all(uploadPromises);
      console.log(uploadedFiles);

      const photoUrls = uploadedFiles.map(
        (response: any) => response.secure_url
      );

      const cleanedPhotoUrls = photoUrls.map((url) =>
        url.replace('https://res.cloudinary.com/', '')
      );

      cleanedPhotoUrls.forEach((url) => {
        formData.append('photos', url);
      });

      // console.log('FormData content:');
      // for (let pair of (formData as any).entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

      const response = await this.hotelService
        .createHotel(formData)
        .toPromise();
      this.isLoading = false;

      this.notify.successMessage('Hotel created successfully');
      this.hotelForm.reset();
      this.selectedFiles = [];
      this.fileNames = '';
    } catch (error: any) {
      this.isLoading = false;
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        if (error.error.message === 'At least one photo is required') {
          this.notify.errorMessage('Please upload at least one photo.');
        } else if (error.error.message === 'Validation Error') {
          this.notify.errorMessage(
            'Validation Error: Please check the input fields.'
          );
        } else {
          this.notify.errorMessage(
            error.error.message ||
              'Unknown error occurred while creating the hotel.'
          );
        }
      } else if (error.status === 500) {
        this.notify.errorMessage('Server Error: Please try again later.');
      } else {
        this.notify.errorMessage('Unknown error. Please try again.');
      }
    } else {
      console.error('Error creating hotel:', error);
      this.notify.errorMessage('Error occurred while creating the hotel.');
    }
  }
}
