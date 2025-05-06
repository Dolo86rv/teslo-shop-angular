import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/intefaces/product-response.interface';
import { ProductResponseService } from '@products/services/product.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'product-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent
],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{
  product = input.required<Product>();
  productService = inject(ProductResponseService);

  fb = inject(FormBuilder);
  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  //Para hacer transformaciones a los valores del formulario
  setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({tags: formLike.tags?.join(', ')});
  }

  onSubmit() {
    const isValid = this.productForm.valid;
    if (!isValid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags
      ?.toLowerCase()
        .split(',').map(tag => tag.trim()) ?? [],
    }
    this.productService.updateProduct(productLike, this.product().id)
      .subscribe((product) => {
        console.log('Producto actualizado', product);
      }
    );
  }

  onSizeClicked(size : string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({sizes: currentSizes});
  }

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

 }
function Parcial<T>(value: Partial<{ title: string | null; description: string | null; slug: string | null; price: number | null; stock: number | null; sizes: string[] | null; images: null; tags: string | null; gender: string | null; }>) {
  throw new Error('Function not implemented.');
}

