import { switchMap, map } from 'rxjs/operators';
import { User } from './../shared/sharedModels';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: Observable<firebase.User>;
  constructor(
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    private db: AngularFireDatabase
  ) {
    this.user$ = auth.authState;
  }

  login(email, password) {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.auth.signOut();
  }

  isLoggedIn() {
    let result;
    this.auth.authState.subscribe((authstate) => {
      if (authstate) {
        result = true;
      } else {
        result = false;
      }
    });

    return result;
  }

  otherLogin(method) {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    if (method == 'facebook') {
      this.auth.signInWithPopup(new auth.FacebookAuthProvider());
    } else if (method == 'google') {
      this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
  }

  get(uid) {
    return this.db.object<User>('users/' + uid).valueChanges();
  }

  getMe() {
    return this.user$.pipe(
      switchMap((user) => {
        return this.get(user.uid);
      })
    );
  }

  save(user: firebase.User) {
    return this.db.object('users/' + user.uid).update({
      email: user.email,
      name: user.displayName,
      photoUrl: user.photoURL,
      id: user.uid,
      emailVerified: user.emailVerified,
    });
  }

  signUp(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    return this.auth.currentUser.then((user) => {
      user.sendEmailVerification();
    });
  }

  //Send reset email link to users.
  sendResetEmail(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  //Password reseting code.
  confirmResetPassword(code, pass) {
    return this.auth.confirmPasswordReset(code, pass);
  }

  //Applying the verification code.
  applyActionCode(code) {
    return this.auth.applyActionCode(code);
  }

  //Update Email Verification Status
  updateEmailVerificationStatus() {
    var userNow = firebase.auth().currentUser;
    return this.db.object('users/' + userNow.uid).set({
      emailVerified: true,
    });
  }

  savePhone(phone) {
    let user = this.auth.currentUser;

    return user.then((user) => {
      return this.db.object<User>('users/' + user.uid).update({
        phoneNumber: phone,
      });
    });
  }
}
