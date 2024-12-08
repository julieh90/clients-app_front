import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Client} from '../models/Client';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private baseUrl = 'http://localhost:9292/client/v1';

  constructor(private http: HttpClient) {

  }

  getClientes(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/`);

  }

  addCliente(client: Client): Observable<Client> {
    console.log('metodo post');
    return this.http.post<Client>(`${this.baseUrl}/`, client);
  }

  updateCliente(updatedClient: Client): Observable<Client> {
    console.log('metodo put ' + updatedClient.businessId + ' ' + updatedClient.sharedKey);
    let urlPut = `${this.baseUrl}/${updatedClient.sharedKey}`;
    console.log(urlPut);

    return this.http.put<Client>(urlPut, updatedClient);
  }


}
