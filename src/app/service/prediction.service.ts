
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
        // Le remoteServiceBaseUrl est défini dans mon fichier de configuration
        return `${this.appConfig.apiUrl}/api/Prediction`;
    }

      //#region READ
  // Retrieves a resource
  // public MakePrediion(): Observable<PredictionResult> {
  //   const url = `${this._baseUrl}`;
  //   return this.httpClient.get<PredictionResult>(url).pipe(map((data: any) => data));
  // }

  //#region SAVE
  public MakePrediction(item: FormData): Observable<any> {
    return this.httpClient
        .post(`${this._baseUrl}/${'Predict'}`, item)
        .pipe(map((data: any) => data));
  }

  //#region SAVE
  public Save(item: PredictionResult): Observable<any> {
      return this.httpClient
        .put(`${this._baseUrl}/${'Save'}`, item)
        .pipe(map((data: any) => data));
  }

  public Delete(id: number): Observable<any> {
    return this.httpClient
        .delete(`${this._baseUrl}/${'Delete'}/${id}`)
        .pipe(map((data: any) => data));
  }

  public GetAll(): Observable<any> {
    return this.httpClient
        .get<PredictionResult[]>(this._baseUrl)
        .pipe(map((data: any) => data));
  }
}
