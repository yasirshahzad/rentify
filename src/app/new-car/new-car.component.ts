import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription, Observable, concat } from 'rxjs';
import { CarService } from '../services/car.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { combineLatest, from, merge } from 'rxjs';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import {
  snapshotChanges,
  listChanges,
} from '@angular/fire/database/public_api';

@Component({
  selector: 'app-new-car',
  templateUrl: './new-car.component.html',
  styleUrls: ['./new-car.component.css'],
})
export class NewCarComponent implements OnInit {
  carForm: FormGroup;
  loading = true;
  locations: string[] = [];
  multimediaOptions: string[] = [
    '12V',
    'Android auto',
    'Apple car play',
    'AUX',
    'Bluetooth music streaming',
    'CD changer',
    'DVD changer',
    'Hand-free kit',
    'MP3 support',
    'Multifunction steering wheel',
  ];

  safetyOptions: string[] = [
    'ABS',
    'Alarm/anti-theft system',
    'Blind spot monitor',
    'Central locking',
    'Driver airbag',
    'Knees airbag',
    'Passenger airbag',
    'Precolission system',
    'Side airbags front',
  ];

  comfortOptions: string[] = [
    'Electric steering wheel adjustment',
    'Electric windows',
    'Front heated seats',
    'Front ventilated seats',
    'Head-up display',
    'Keyless engine start-stop',
    'Keyless entry',
    'On-board computer',
    'Privacy glass',
    'Remote engine start',
  ];
  visibilityOptions: string[] = [
    'Electric mirrors',
    'Fog lamps',
    'Front parking sensors',
    'Heated mirrors',
    'Heated windscreen',
    'Light sensor',
  ];
  locationOptions = ['Lahore', 'Karachi', 'Islamabad', 'Multan'];
  extriorOptions: string[] = ['Aerography', 'Decals / Vinyls'];

  interiorOptions: string[] = ['Auxiliary heating', 'Electric seat adjustment'];

  //Selected Controls Values;
  selectedLocations: string[] = [];
  selectedmultimedia: string[] = [];

  selectedSafety: string[] = [];

  selectedComfort: string[] = [];
  selectedVisibility: string[] = [];
  selectedExterior: string[] = [];
  selectedInterior: string[] = [];

  carSub: Subscription;
  locationSub: Subscription;
  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private notification: NzNotificationService,
    private storage: AngularFireStorage
  ) {
    this.carForm = this.fb.group({
      model: ['', Validators.required],
      multimedia: ['', Validators.required],
      brand: ['', Validators.required],
      year: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      interiorColor: [
        '',
        [Validators.required, Validators.pattern('^[a-z]*$')],
      ],
      exteriorColor: [
        '',
        [Validators.required, Validators.pattern('^[a-z]*$')],
      ],
      price: ['', [Validators.required]],
      mileage: ['', Validators.required],
      safety: ['', [Validators.required]],
      comfort: ['', Validators.required],
      visibility: ['', Validators.required],
      interior: ['', [Validators.required]],
      exterior: ['', Validators.required],
      fuelType: ['', Validators.required],
      condition: ['', Validators.required],
      transmission: ['', Validators.required],
      locations: ['', Validators.required],
      description: ['', Validators.required],
      gallery: [''],

      prices: this.fb.array([]),
      extras: this.fb.array([]),
      engine: this.fb.group({
        noOfCylinder: ['', Validators.required],
        engineVolume: ['', Validators.required],
        horsePower: ['', Validators.required],
        tourque: ['', Validators.required],
      }),
      fuel: this.fb.group({
        highway: ['', Validators.required],
        combined: ['', Validators.required],
        fuelTank: ['', Validators.required],
        emissionClass: ['', Validators.required],
      }),
      emission: this.fb.group({
        type: ['', Validators.required],
        displacement: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.locationSub = this.carService.getLocations().subscribe((locations) => {
      if (locations.length < 1) {
        this.locations = this.locationOptions;
      } else {
        this.locations = locations;
      }

      this.loading = false;
    });
  }

  updateCar() {
    this.loading = true;
    this.uploadFiles()
      .then((url) => {
        this.carForm.controls['gallery'].setValue(url);

        this.carService
          .addCar(this.carForm.value)
          .then((result) => {
            this.loading = false;
            this.notification.success('Success', 'Car data has been added.', {
              nzPlacement: 'bottomLeft',
            });
          })
          .catch((err) => {
            this.notification.error('Problem!', err.message, {
              nzPlacement: 'bottomLeft',
            });
          });
      })
      .catch((err) => {
        this.notification.error('Problem!', err.message, {
          nzPlacement: 'bottomLeft',
        });
      });
  }

  //New newPrice
  newPrice(): FormGroup {
    return this.fb.group({
      days: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  addPrice() {
    this.prices.push(this.newPrice());
  }
  removePrices(i) {
    this.prices.removeAt(i);
  }
  //New Extras
  newExtras(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      Price: ['', Validators.required],
    });
  }

  addExtras() {
    this.extras.push(this.newExtras());
  }

  removeExtras(i: number) {
    this.extras.removeAt(i);
  }
  ngOnDestroy(): void {
    this.locationSub.unsubscribe();
  }

  get prices() {
    return this.carForm.controls['prices'] as FormArray;
  }

  get extras() {
    return this.carForm.controls['extras'] as FormArray;
  }

  get brand() {
    return this.carForm.controls['brand'];
  }

  get year() {
    return this.carForm.controls['year'];
  }

  get exteriorColor() {
    return this.carForm.controls['exteriorColor'];
  }

  get price() {
    return this.carForm.controls['price'];
  }
  get mileage() {
    return this.carForm.controls['mileage'];
  }

  get interiorColor() {
    return this.carForm.controls['interiorColor'];
  }

  get fuelType() {
    return this.carForm.controls['fuelType'];
  }

  LocationChange() {
    if (this.selectedLocations.length <= 0) {
      this.locationsControl.setErrors({
        required: 'Please select minimum one location.',
      });
    } else {
      this.locationsControl.setErrors(null);
      this.locationsControl.setValue(this.selectedLocations);
    }
  }

  changeSafety() {
    if (this.selectedSafety.length <= 0) {
      this.carForm.controls['safety'].setErrors({
        required: 'Please select minimum one safety option.',
      });
    } else {
      this.carForm.controls['safety'].setErrors(null);
      this.carForm.controls['safety'].setValue(this.selectedSafety);
    }
  }

  changeVisibility() {
    if (this.selectedVisibility.length <= 0) {
      this.carForm.controls['visibility'].setErrors({
        required: 'Please select minimum one visibility option.',
      });
    } else {
      this.carForm.controls['visibility'].setErrors(null);
      this.carForm.controls['visibility'].setValue(this.selectedVisibility);
    }
  }

  changeInterior() {
    if (this.selectedInterior.length <= 0) {
      this.carForm.controls['interior'].setErrors({
        required: 'Please select minimum one interior option.',
      });
    } else {
      this.carForm.controls['interior'].setErrors(null);
      this.carForm.controls['interior'].setValue(this.selectedInterior);
    }
  }

  changeComfort() {
    if (this.selectedComfort.length <= 0) {
      this.carForm.controls['comfort'].setErrors({
        required: 'Please select minimum one comfort option.',
      });
    } else {
      this.carForm.controls['comfort'].setErrors(null);
      this.carForm.controls['comfort'].setValue(this.selectedComfort);
    }
  }

  changeExterior() {
    if (this.selectedExterior.length <= 0) {
      this.carForm.controls['exterior'].setErrors({
        required: 'Please select minimum one exterior option.',
      });
    } else {
      this.carForm.controls['exterior'].setErrors(null);
      this.carForm.controls['exterior'].setValue(this.selectedExterior);
    }
  }
  changeMultimedia() {
    if (this.selectedmultimedia.length <= 0) {
      this.carForm.controls['multimedia'].setErrors({
        required: 'Please select minimum one multimedia option.',
      });
    } else {
      this.carForm.controls['multimedia'].setErrors(null);
      this.carForm.controls['multimedia'].setValue(this.selectedExterior);
    }
  }

  get locationsControl() {
    return this.carForm.controls['locations'];
  }

  get description() {
    return this.carForm.controls['description'];
  }
  filelist = [];

  onSelectFile(event) {
    this.filelist = event.target.files;
  }

  uploadFiles() {
    let list = [];

    for (const file of this.filelist) {
      const path = `files/${file.name}`;
      const task = this.storage.upload(path, file);
      const _t = task.then((f) => {
        return f.ref.getDownloadURL().then((url) => {
          console.log(url);
          return url;
        });
      });

      list.push(_t);
    }

    return Promise.all(list);
  }

  get gallery() {
    return this.carForm.controls['gallery'];
  }

  get condition() {
    return this.carForm.controls['condition'];
  }
}
