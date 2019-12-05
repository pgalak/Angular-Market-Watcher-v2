import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private url = 'https://angular-market-watcher.firebaseio.com/data.json';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.http
      .get(this.url)
      .subscribe(data => {
        console.log(data[0]);
      })
  }
}
