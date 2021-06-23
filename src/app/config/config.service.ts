import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InConfiguration } from '../core/models/config.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public configData: InConfiguration;
  public apiUrl: string;

  constructor() {
    this.setConfigData();
  }

  setConfigData() {
    this.apiUrl = environment.apiUrl;
    this.configData = {
      layout: {
        rtl: true, // options:  true & false
        variant: 'light', // options:  light & dark
        theme_color: 'white', // options:  white, black, purple, blue, cyan, green, orange
        logo_bg_color: 'white', // options:  white, black, purple, blue, cyan, green, orange
        sidebar: {
          collapsed: false, // options:  true & false
          backgroundColor: 'light', // options:  light & dark
        },
      },
    };
  }
}
