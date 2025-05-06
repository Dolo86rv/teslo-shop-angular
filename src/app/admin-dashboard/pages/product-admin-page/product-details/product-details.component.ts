import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/intefaces/product-response.interface';
import { ProductResponseService } from '@products/services/product.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@utils/form-utils';
import { firstValueFrom } from 'rxjs';

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
  router = inject(Router);

  wasSaved = signal(false);
  tempImage = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;
  imageToCarousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImage()];

    return currentProductImages;
  })

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

  async onSubmit() {
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

    if ( this.product().id === 'new') {
      //Crear producto
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      );
      this.router.navigate(['/admin/products', product.id]);

    } else {

       await firstValueFrom(
        this.productService.updateProduct(
          productLike,
          this.product().id,
          this.imageFileList)
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }
    , 3000);
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


  //Images
  onFilesChanged(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    this.imageFileList = files ?? undefined;

    const imageUrl = Array.from(files ?? []).map(
      file => URL.createObjectURL(file));

    this.tempImage.set(imageUrl);
  }

 }


