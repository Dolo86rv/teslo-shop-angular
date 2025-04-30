import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductResponseService } from '@products/services/product.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  productsService = inject(ProductResponseService);

  productResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.productsService.getProducts({});
    },
  });

}
