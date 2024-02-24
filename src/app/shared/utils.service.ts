import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class UtilsService {

  static validatePass(control: AbstractControl): { [key: string]: boolean } | null {
    const strongPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d).+/;
    const isValid = strongPasswordPattern.test(control.value);
    if (!isValid) {
      return { password: true };
    }
    return null;
  }

  static matchOtherValidator(otherControlName: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (otherControl.value !== thisControl.value) {
        return {
          invalid: true
        };
      }

      return null;
    }
  }

  static validateTelephone(control: FormControl): { [key: string]: boolean } | null {
    const telephone = control.value;

    const numbers = telephone.replace(/\s|[-()]/g, '').length;

    if (numbers > 10 && numbers < 16) {
      return null;
    } else {
      return { invalid: true };
    }
  }
}
