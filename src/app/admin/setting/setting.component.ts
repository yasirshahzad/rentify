import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from './../../shared/sharedModels';
import { Subscription } from 'rxjs';
import { UserService } from './../../services/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  user: User;
  loading = false;

  emailChangeForm: FormGroup;
  profileForm: FormGroup;
  passwordChangeForm: FormGroup;
  constructor(
    private auth: UserService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private messageService: NzNotificationService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      photoUrl: ['', Validators.required],
      phone: ['', [Validators.required]],
    });

    this.emailChangeForm = this.fb.group({
      currentEmail: ['', Validators.email],
      newEmail: ['', [Validators.required, Validators.email]],
    });

    this.passwordChangeForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.subscription = this.auth.getMe().subscribe((user) => {
      this.user = user;
      console.log(user);
      this.profileForm.patchValue({
        name: user.name,
        photoUrl: user.photoUrl,
        phone: user.phoneNumber,
      });

      this.emailChangeForm.patchValue({
        currentEmail: user.email,
      });
    });
  }

  message;

  //Changing Password Submissing
  onSubmitPasswordChangeForm() {
    if (this.passwordChangeForm.valid) {
      let user = firebase.auth().currentUser;

      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.passwordChangeForm.value.currentPassword
      );
      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          user
            .updatePassword(this.passwordChangeForm.value.newPassword)
            .then(() => {
              this.messageService.success(
                'Success',
                'Password has been changed.',
                { nzPlacement: 'bottomLeft' }
              );
            })
            .catch((error) => {
              this.messageService.error('Problem', error.message, {
                nzPlacement: 'bottomLeft',
              });
            });
        })
        .catch((error) => {
          console.log(error);
          this.messageService.error('Problem', error.message, {
            nzPlacement: 'bottomLeft',
          });
        });
    }
  }
  //Submitting email change form
  onSubmitEmailChangeForm() {
    if (this.emailChangeForm.valid) {
      let user = firebase.auth().currentUser;

      user
        .updateEmail(this.emailChangeForm.value.newEmail)
        .then((resp) => {
          this.message = 'Email has been changed';
        })
        .catch((error) => {
          this.emailChangeForm.setErrors({ loginAgain: error.message });
        });
    }
  }
  logout() {
    this.auth.logout();
  }
  onSubmitProfileForm() {
    if (!this.profileForm.valid) {
      return;
    }
    let user = firebase.auth().currentUser;
    const file = this.fileSelectionEvent;
    var metadata = {
      contentType: file.type,
    };
    let storageref = this.storage.ref('images/profiles/' + file.name);
    const task = storageref.put(file, metadata);
    this.uploadPercent = task.percentageChanges();
    task.then(
      (x) => {
        storageref.getDownloadURL().subscribe((url) => {
          this.photoUrl.setValue(x.downloadURL);
          user
            .updateProfile({
              displayName: this.profileForm.value.name,
              photoURL: url,
            })
            .catch((err) => {
              this.messageService.error('Problem', err.message, {
                nzPlacement: 'bottomLeft',
              });
            });
          user.reload();
          this.auth
            .save(user)
            .then((res) => {
              this.auth
                .savePhone(this.phone.value)
                .then((result) => {
                  //done
                })
                .catch((err) => {
                  this.messageService.error('Problem', err.message, {
                    nzPlacement: 'bottomLeft',
                  });
                });
            })
            .catch((err) => {
              this.messageService.error('Problem', err.message, {
                nzPlacement: 'bottomLeft',
              });
            });
          user.reload();
        });
      },
      (err) => {
        console.log('err', err);
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  emailSent = false;
  sendVerificationEmail() {
    let user = firebase.auth().currentUser;
    user
      .sendEmailVerification()
      .then((result) => {
        this.emailSent = true;
        this.messageService.success(
          'Success',
          'Email has been sent. Please check inbox. ',
          { nzPlacement: 'bottomLeft' }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  uploadPercent;
  fileSelectionEvent: File;

  onSelectFile(event) {
    // called each time file input changes
    this.fileSelectionEvent = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.photoUrl.setValue(event.target.result);
      };
    }
  }

  //Getting Form Profile URL
  get photoUrl() {
    return this.profileForm.controls['photoUrl'];
  }

  get currentEmail() {
    return this.emailChangeForm.controls['currentEmail'];
  }

  get newEmail() {
    return this.emailChangeForm.controls['newEmail'];
  }

  get newPassword() {
    return this.passwordChangeForm.controls['newPassword'];
  }

  get currentPassword() {
    return this.passwordChangeForm.controls['currentPassword'];
  }

  get phone() {
    return this.profileForm.controls['phone'];
  }
}
