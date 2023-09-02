import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  constructor(private http: HttpClient) {}

  getJsonData(filePath: string): Observable<any> {
    return this.http.get(filePath);
  }
}
