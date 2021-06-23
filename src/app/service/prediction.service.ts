
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from "../config/config.service";
import { PredictionResult } from '../models/prediction-result';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
    constructor(protected readonly httpClient: HttpClient, protected readonly appConfig: ConfigService) {}

    protected get _baseUrl(): string {
        const endPoint = 'api/Prediction';
        // Le remoteServiceBaseUrl est défini dans mon fichier de configuration
        return `${this.appConfig.apiUrl}/${endPoint}`;
    }

      //#region READ
  // Retrieves a resource
  public MakePrediction(): Observable<PredictionResult> {
    const url = `${this._baseUrl}`;
    return this.httpClient.get<PredictionResult>(url).pipe(map((data: any) => data));
  }

    //#region SAVE
    public Save(item: FormData): Observable<any> {
        return this.httpClient
          .post(this._baseUrl, item)
          .pipe(map((data: any) => data));
    }
}