import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductResponseService } from '@products/services/product.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);
  productsService = inject(ProductResponseService);

  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  )

  productResource = rxResource({
    request: () => ({gender: this.gender() }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
      });
    },
  });
}
