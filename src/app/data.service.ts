import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Share } from './share';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private url = 'http://localhost:4000/data';
  private url = 'https://my-json-server.typicode.com/pgalak/mock-data/data';
  // private firebaseUrl = 'https://angular-market-watcher.firebaseio.com/data.json';

  constructor(private http: HttpClient) {}

  searchShares(term: string): Observable<Share[]> {
    if (!term.trim()) {
      return of([]);
    }    
    return this.http.get<Share[]>(`${this.url}/?q=${term}`);
  }
}
