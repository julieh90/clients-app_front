import {Component} from '@angular/core';
import {Client} from '../../models/Client';
import {ClientService} from '../../service/ClientService';

import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {HttpClientModule} from '@angular/common/http';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';



@Component({
  providers: [ClientService],
  selector: 'app-client',
  imports: [
    FormsModule,
    CommonModule,
    MatSlideToggleModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    HttpClientModule,
    MatTableModule,
    MatNativeDateModule,

  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
  standalone: true,
})
export class ClientComponent {
  myForm: FormGroup;
  isVisible = false; // Controla la visibilidad del segmento
  client: Client[] = [];
  selectedClient: Client = {sharedKey: '', businessId: '', email: '', phone: 0, startDate: '', endDate: ''};
  currentSection: string = 'Cliente';
  searchCriteria: string = '';
  formVisible: boolean = false;
  displayedColumns: string[] = ['sharedKey', 'businessId', 'email', 'phone', 'startDate', 'endDate', 'Edit'];
  dataSource = new MatTableDataSource(this.client);


  constructor(private clientService: ClientService, private fb: FormBuilder) {

    this.myForm = this.fb.group({
      sharedKey: [''],
      businessId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],

    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  onSubmit(): void {
    console.log(this.myForm.valid);
    if (this.myForm.valid) {
      if (this.selectedClient.sharedKey) {
        console.log('onsubmit -- actualizar'+this.myForm.value)
        this.actualizarCliente(this.myForm.value);

      } else {
        console.log(this.myForm.value);
        this.agregarCliente(this.myForm.value);

      }
    } else {

      console.error('Formulario no válido', this.myForm.errors);
    }
  }


  toggleSegment(): void {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      this.clearForm();
    }
  }

  cargarClientes(): void {
    console.log('Cargar clientes');
    this.clientService.getClientes().subscribe((data) => {
      this.client = data;
      this.dataSource = new MatTableDataSource<Client, MatPaginator>(this.client)
    });
  }

  agregarCliente(client: Client): void {

    this.clientService.addCliente(client).subscribe({
      next: (addCliente) => {
        console.log('Cliente creado correctamente:', addCliente);
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error al crear el cliente:', error);
      }
    });
    this.clearForm();
    this.isVisible = false;
  }


  editarCliente(client: Client): void {
    console.log('editarCliente' + client.sharedKey)
    this.selectedClient = {...client};
    this.myForm.patchValue(client);
    this.isVisible = true;
  }

  eliminarCliente(client: Client): void {
    console.log('eliminar ' + client.businessId);

    this.clientService.deleteClient(client).subscribe({
      next: (updatedClient) => {
        console.log('Cliente eliminado correctamente:', updatedClient);
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error al eliminar el cliente:', error);
      }
    });
  }

  actualizarCliente(client: Client): void {
    console.log('actualizar ' + client.businessId);

    this.clientService.updateCliente(client).subscribe({
      next: (updatedClient) => {
        console.log('Cliente actualizado correctamente:', updatedClient);
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error al actualizar el cliente:', error);
      }
    });

    this.clearForm();
    this.isVisible = false;
  }


  clearForm(): void {
    this.myForm.reset();
    this.selectedClient = {sharedKey: '', businessId: '', email: '', phone: 0, startDate: '', endDate: ''}
  }

  triggerDownload(): void {
    this.clientService.triggerDownload();
  }

  setSection(section: string) {
    this.currentSection = section;
     if (section === 'cliente') {
      console.log('setSection');
      this.cargarClientes();
    }


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }






}
