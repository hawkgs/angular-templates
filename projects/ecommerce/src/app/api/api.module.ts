import { NgModule } from '@angular/core';
import { ProductsApi } from './products-api.service';
import { fetchApiProvider } from '../shared/fetch';

@NgModule({
  providers: [fetchApiProvider, ProductsApi],
})
export class ApiModule {}
