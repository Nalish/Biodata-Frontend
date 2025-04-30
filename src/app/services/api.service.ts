import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';  // Backend URL

  constructor(private http: HttpClient) {}




  getDummyChristianCount(): Observable<any> {
    const dummyData = { count: 42 }; // Replace 42 with any dummy count value
    return new Observable(observer => {
      observer.next(dummyData);
      observer.complete();
    });
  }


  loginChristian(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }
  registerChristian(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  logoutChristian(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, { withCredentials: true });
  }



getChristians(): Observable < any > {
  return this.http.get(`${this.baseUrl}/users`);
}

getChristianById(id: string): Observable < any > {
  return this.http.get(`${this.baseUrl}/users/${id}`);
}
getChristianByName(name: string): Observable < any > {
  return this.http.get(`${this.baseUrl}/users/name/${name}`);
}

getChristianCount(): Observable < any > {
  return this.http.get(`${this.baseUrl}/users/count`);
}

updateChristian(id: string, data: any): Observable < any > {
  return this.http.put(`${this.baseUrl}/users/${id}`, data);
}
deleteChristian(id: string): Observable < any > {
  return this.http.delete(`${this.baseUrl}/users/${id}`);
}

getBaptisms(): Observable < any > {
  return this.http.get(`${this.baseUrl}/baptism`);
}
getBaptismById(id: string): Observable < any > {
  return this.http.get(`${this.baseUrl}/baptism/${id}`);
}
createBaptism(data: any): Observable < any > {
  return this.http.post(`${this.baseUrl}/baptism`, data);
}
updateBaptism(id: string, data: any): Observable < any > {
  return this.http.put(`${this.baseUrl}/baptism/${id}`, data);
}
deleteBaptism(id: string): Observable < any > {
  return this.http.delete(`${this.baseUrl}/baptism/${id}`);
}

getEucharists(): Observable < any > {
  return this.http.get(`${this.baseUrl}/eucharist`);
}
getEucharistById(id: string): Observable < any > {
  return this.http.get(`${this.baseUrl}/eucharist/${id}`);
}
createEucharist(data: any): Observable < any > {
  return this.http.post(`${this.baseUrl}/eucharist`, data);
}
updateEucharist(id: string, data: any): Observable < any > {
  return this.http.put(`${this.baseUrl}/eucharist/${id}`, data);
}
deleteEucharist(id: string): Observable < any > {
  return this.http.delete(`${this.baseUrl}/eucharist/${id}`);
}

getConfirmations(): Observable < any > {
  return this.http.get(`${this.baseUrl}/confirmation`);
}
getConfirmationById(id: string): Observable < any > {
  return this.http.get(`${this.baseUrl}/confirmation/${id}`);
}
createConfirmation(data: any): Observable < any > {
  return this.http.post(`${this.baseUrl}/confirmation`, data);
}
updateConfirmation(id: string, data: any): Observable < any > {
  return this.http.put(`${this.baseUrl}/confirmation/${id}`, data);
}
deleteConfirmation(id: string): Observable < any > {
  return this.http.delete(`${this.baseUrl}/confirmation/${id}`);
}

getMarriages(): Observable < any > {
  return this.http.get(`${this.baseUrl}/marriage`);
}
getMarriageById(id: string): Observable < any > {
  return this.http.get(`${this.baseUrl}/marriage/${id}`);
}
createMarriage(data: any): Observable < any > {
  return this.http.post(`${this.baseUrl}/marriage`, data);
}
updateMarriage(id: string, data: any): Observable < any > {
  return this.http.put(`${this.baseUrl}/marriage/${id}`, data);
}
deleteMarriage(id: string): Observable < any > {
  return this.http.delete(`${this.baseUrl}/marriage/${id}`);
}


}
