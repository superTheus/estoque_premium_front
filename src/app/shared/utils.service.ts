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

  public padWithZeros(value?: number): string {
    if (!value) {
      return '';
    }
    let str = value.toString();
    return str.padStart(4, '0').substr(-4);
  }

  public formatDocument(document?: string): string {
    if (!document) {
      return '';
    }
    document = document.replace(/[^\d]+/g, '');

    if (document.length === 11) {
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (document.length === 14) {
      return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return document;
  }

  public formatPhoneNumber(phoneNumber?: string): string {
    if (!phoneNumber) {
      return '';
    }
    phoneNumber = phoneNumber.replace(/[^\d]+/g, '');

    if (phoneNumber.length === 10) {
      return phoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phoneNumber.length === 11) {
      return phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return phoneNumber;
  }

  public generatePassword(id: string): string {
    let date = new Date();
    let timestamp = date.getTime();
    let randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${id}${timestamp}${randomNum}`;
  }

  public hasOneDayDifference(inputDate: string): number {
    let date1 = new Date(inputDate);
    date1.setHours(0, 0, 0, 0);
    let date2 = new Date();
    date2.setHours(0, 0, 0, 0);
    let differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
    let differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    return differenceInDays;
  }

  public formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  public currencyToNumber(value: string) {
    return Number(value.replace(/\D/g, '')) / 100;
  }

  public numberToCurrency(value: number) {
    return this.formatCurrency(value);
  }

  public formatNumberMoney(control: AbstractControl) {
    if (control.value) {
      let value = control.value.replace(/\D/g, '');
      value = this.formatCurrency(Number(value) / 100);
      control.setValue(value);
    }
  }

  public isDateLessThanCurrent(dateStr: string): boolean {
    const inputDate = new Date(dateStr);
    inputDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return inputDate.getTime() < currentDate.getTime();
  }

  public formatDate(date: string): string {
    const newDate = new Date(date);
    const day = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const year = newDate.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
