import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecureWebStorageService {

  constructor() { }

  encrypt(obj: any, secret: string): string {
    const cypherText = CryptoJS.AES.encrypt(JSON.stringify(obj), secret).toString();

    return cypherText;
  }

  decrypt(cypherText: string, secret: string, isObject = true): any {
    let data: any;
    try {
      const bytes = CryptoJS.AES.decrypt(cypherText, secret);
      if (isObject) {
        data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } else {
        data = bytes.toString(CryptoJS.enc.Utf8);
      }
    } catch (error) {
      if (isObject) {
        data = {};
      } else {
        data = '';
      }
    }

    return data;
  }
}
