import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductResponseService } from '@products/services/product.service';
import { map } from 'rxjs';
import { ProductDetailsComponent } from './product-details/product-details.component';


@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  productService = inject(ProductResponseService);
  activatedRoute = inject(ActivatedRoute); //Para tomar la ruta activa
  router = inject(Router); //para realizar una redireccion

  productId = toSignal(
    this.activatedRoute.params.pipe(
      map(params => params['id'])),
  )

  /*Para traer la data del producto*/
  productResource = rxResource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id)
    },
  })

  /*En caso que no exista el producto o un error*/
  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  })
}
