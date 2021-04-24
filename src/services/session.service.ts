import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User } from 'src/models/models';
import { SecureWebStorageService } from './secure-web-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private GENERAL_ENCRYPTION_KEY = '51781sbahah178289172991971ASDSDDSAS';
  private SESS_TOKEN_KEY = 'gaja2y288178917s';
  private AFTER_LOGIN_SESS_KEY = 'xadjsgahhagghha';
  private AUTHORIZATIONS_KEY = 'XAGHSKKAHJWHHAK';
  private jwtService = new JwtHelperService();

  constructor(
    private router: Router,
    private secureWebStorage: SecureWebStorageService
  ) { }

  sessionIsActive(): boolean {
    let returnValue = false;
    const token = window.sessionStorage.getItem(this.SESS_TOKEN_KEY);
    if (!token) {
      returnValue = false;
    } else {
      returnValue = !this.jwtService.isTokenExpired(token);
    }

    return returnValue;
  }

  setAfterLoginUrl(url: string): void {
    if (!url) {
      url = '/tickets';
    }

    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    window.sessionStorage.setItem(this.AFTER_LOGIN_SESS_KEY, this.secureWebStorage.encrypt(url, this.GENERAL_ENCRYPTION_KEY));
  }

  getAfterLoginUrl(): string {
    let url = window.sessionStorage.getItem(this.AFTER_LOGIN_SESS_KEY);
    if (!url) {
      url = '/tickets';
    } else {
      url = this.secureWebStorage.decrypt(url, this.GENERAL_ENCRYPTION_KEY, false) as string;
    }

    return url;
  }

  login(token: string, authorizations: Array<string>): void {
    window.sessionStorage.setItem(this.SESS_TOKEN_KEY, token);
    window.sessionStorage.setItem(this.AUTHORIZATIONS_KEY, this.secureWebStorage.encrypt(authorizations, token));
    this.router.navigateByUrl(this.getAfterLoginUrl());
    window.sessionStorage.removeItem(this.AFTER_LOGIN_SESS_KEY);
    window.location.reload();
  }

  logout(): void {
    window.sessionStorage.removeItem(this.AFTER_LOGIN_SESS_KEY);
    window.sessionStorage.removeItem(this.SESS_TOKEN_KEY);
    window.sessionStorage.removeItem(this.AUTHORIZATIONS_KEY);
    this.router.navigateByUrl('/');
    window.location.reload();
  }

  getToken(): string | null {
    const token = window.sessionStorage.getItem(this.SESS_TOKEN_KEY);
    return token;
  }

  getUser(): User {
    let user: User;
    if (this.sessionIsActive()) {
      const token = this.getToken() as string;
      user = this.jwtService.decodeToken(token);
    } else {
      return {} as User;
    }

    return user;
  }

  getAuthAreas(): Array<string> {
    const cypherText = window.sessionStorage.getItem(this.AUTHORIZATIONS_KEY) as string;
    const key = this.getToken() as string;
    const areas = this.secureWebStorage.decrypt(cypherText, key) as Array<string>;
    if (Object.keys(areas).length === 0) {
      return [];
    }

    return areas;
  }

  canAccessModule(mod: string): boolean {
    let returnVal = false;
    if (!mod) {
      returnVal = false;
    } else {
      const actualMod = this.getAuthAreas().find(i => i.toLowerCase().startsWith(mod.toLowerCase()));
      if (actualMod) {
        returnVal = true;
      }
    }

    return returnVal;
  }

  canAccessItem(item: string): boolean {
    let returnVal = false;
    if (!item) {
      returnVal = false;
    } else {
      const area = this.getAuthAreas().find(i => i.toLowerCase() === item.toLowerCase());
      if (area) {
        returnVal = true;
      }
    }

    return returnVal;
  }
}
