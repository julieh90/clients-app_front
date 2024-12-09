import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Client} from '../models/Client';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { saveAs } from 'file-saver';



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
  downloadCsv(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/csv',
    });

    console.log('Entro a download'+`${this.baseUrl}/csv`);
    return this.http.get<Blob>(`${this.baseUrl}/csv`, { headers, responseType: 'blob' as 'json' });
  }

  triggerDownload(): void {
    this.downloadCsv().subscribe((response: Blob) => {
      saveAs(response, 'clients.csv');
    });
  }

  deleteClient(client: Client): Observable<Client> {
    console.log('metodo delete ' + client.businessId + ' ' + client.sharedKey);
    let urlDelete = `${this.baseUrl}/${client.sharedKey}`;
    console.log(urlDelete);

    return this.http.delete<Client>(urlDelete);
  }



}
