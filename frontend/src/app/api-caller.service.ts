import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const SIGNIN_URL = "http://localhost:8000/auth/signin";
const SIGNUP_URL = "http://localhost:8000/auth/signup";

@Injectable({
  providedIn: 'root'
})
export class ApiCallerService {

  constructor(private http: HttpClient) {
  }

  signIn(username: string, password: string) {
    var httpResponse:string = ""
    this.http.post<any>(SIGNIN_URL, { username: username, password: password })
    .subscribe()
  }

  signUp(username: string, password: string) {
    var httpResponse:string = ""
    this.http.post<any>(SIGNUP_URL, { username: username, password: password }, {observe: 'response'})
    .subscribe(response => {
    
      // You can access status:
      console.log(response.status)
      
      // Or any other header:
      console.log(response.headers.get('X-Custom-Header'))
    })
  }
  }