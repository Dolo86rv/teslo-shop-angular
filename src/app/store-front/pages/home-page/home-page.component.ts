import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductResponseService } from '@products/services/product.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  productsService = inject(ProductResponseService);

  paginationService = inject(PaginationService);
  /*activateRoute = inject(ActivatedRoute);
  currentPage = toSignal(
    this.activateRoute.queryParamMap.pipe(
      map((params) =>(params.get('page') ? +(params.get('page'))! : 1)),
      map(page => (isNaN(page) ? 1 : page))

    ),
    { initialValue: 1 }
  );*/

  productResource = rxResource({
    request: () => ({page: this.paginationService.currentPage() - 1}),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9,
      });
    },
  });

}
