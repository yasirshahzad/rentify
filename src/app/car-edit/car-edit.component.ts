import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CarService } from './../services/car.service';
import { Car, Price, Extra, Engine } from './../shared/sharedModels';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css'],
})
export class CarEditComponent implements OnInit, OnDestroy {
  carForm: FormGroup;

  car: Car;
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
    private route: ActivatedRoute,
    private carService: CarService,
    private notification: NzNotificationService
  ) {
    this.carForm = this.fb.group({
      id: ['', [Validators.required]],
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
    this.carSub = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return this.carService.getCar(params.get('id'));
        })
      )
      .subscribe((car: Car) => {
        this.carForm.patchValue({
          id: car.id,
          model: car.model,
          brand: car.brand,
          year: car.year,
          interiorColor: car.interiorColor,
          exteriorColor: car.exteriorColor,
          price: car.price,
          mileage: car.mileage,
          fuelType: car.fuelType,
          condition: car.condition,
          transmission: car.transmission,
          description: car.description,
          safety: car.safety,
          comfort: car.comfort,
          interior: car.interior,
          exterior: car.exterior,
          visibility: car.visibility,
          fuel: {
            highway: car.fuel.highway,
            combined: car.fuel.combined,
            fuelTank: car.fuel.fuelTank,
            emissionClass: car.fuel.emissionClass,
          },
          emission: {
            type: car.emission.type,
            displacement: car.emission.displacement,
          },
          locations: car.locations,
          multimedia: car.multimedia,
          gallery: car.gallery,
        });

        this.selectedmultimedia = car.multimedia;
        console.log(car.multimedia);
        this.selectedLocations = car.locations;
        this.selectedSafety = car.safety;
        this.selectedComfort = car.comfort;
        this.selectedVisibility = car.visibility;
        this.selectedExterior = car.exterior;
        this.selectedInterior = car.interior;
        this.carForm.setControl('prices', this.setPrices(car.prices));
        this.carForm.setControl('extras', this.setExistingExtras(car.extras));
        this.carForm.setControl(
          'engine',
          this.setExistingEngineVolume(car.engine)
        );

        console.log(car);
        this.loading = false;
      });

    this.locationSub = this.carService.getLocations().subscribe((locations) => {
      this.locations = locations;
    });
  }

  updateCar() {
    if (this.carForm.valid) {
      this.carService
        .saveCar(this.carForm.value)
        .then((result) => {
          this.notification.success('Success', 'Car data has been updated.', {
            nzPlacement: 'bottomLeft',
          });
        })
        .catch((err) => {
          this.notification.error('Problem!', err.message, {
            nzPlacement: 'bottomLeft',
          });
        });
    } else {
      console.log(this.carForm);
    }
  }

  setExistingEngineVolume(engine: Engine) {
    return this.fb.group({
      noOfCylinder: engine.noOfCylinder,
      engineVolume: engine.engineVolume,
      horsePower: engine.horsePower,
      tourque: engine.tourque,
    });
  }

  setExistingExtras(extras: Extra[]): FormArray {
    let array = new FormArray([]);

    extras.forEach((extra: Extra) => {
      array.push(
        this.fb.group({
          name: [extra.name, [Validators.required]],
          Price: [extra.Price, [Validators.required]],
        })
      );
    });

    return array;
  }

  setPrices(prices: Price[]) {
    let array = new FormArray([]);

    for (let index = 0; index < prices.length; index++) {
      const element = prices[index];

      array.push(
        this.fb.group({
          price: [element.price, Validators.required],
          days: [element.days, Validators.required],
        })
      );
    }
    return array;
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
    this.carSub.unsubscribe();
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

  locationError = null;

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

  changeMultimedia() {
    if (this.multimediaOptions.length <= 0) {
      this.carForm.controls['multimedia'].setErrors({
        required: 'Please select minimum one multimedia option.',
      });
    } else {
      this.carForm.controls['multimedia'].setErrors(null);
      this.carForm.controls['multimedia'].setValue(this.selectedmultimedia);
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

  get locationsControl() {
    return this.carForm.controls['locations'];
  }

  get description() {
    return this.carForm.controls['description'];
  }

  onSelectFile(event) {}

  get gallery() {
    return this.carForm.controls['gallery'];
  }
}
