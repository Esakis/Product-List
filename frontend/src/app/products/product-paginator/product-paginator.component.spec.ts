import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPaginatorComponent } from './product-paginator.component';

describe('ProductPaginatorComponent', () => {
  let fixture: ComponentFixture<ProductPaginatorComponent>;
  let component: ProductPaginatorComponent;
  let componentRef: ComponentRef<ProductPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPaginatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPaginatorComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  function setInputs(page: number, pageSize: number, total: number): void {
    componentRef.setInput('page', page);
    componentRef.setInput('pageSize', pageSize);
    componentRef.setInput('total', total);
    fixture.detectChanges();
  }

  it('computes total pages from total and page size', () => {
    setInputs(1, 10, 25);
    expect(component.totalPages()).toBe(3);
  });

  it('returns at least one total page when total is zero', () => {
    setInputs(1, 10, 0);
    expect(component.totalPages()).toBe(1);
  });

  it('disables previous on the first page and next on the last page', () => {
    setInputs(1, 10, 25);
    expect(component.canGoPrevious()).toBeFalse();
    expect(component.canGoNext()).toBeTrue();

    setInputs(3, 10, 25);
    expect(component.canGoPrevious()).toBeTrue();
    expect(component.canGoNext()).toBeFalse();
  });

  it('emits the next page when goNext is called and not on the last page', () => {
    setInputs(1, 10, 25);
    const emissions: number[] = [];
    component.pageChange.subscribe(value => emissions.push(value));

    component.goNext();

    expect(emissions).toEqual([2]);
  });

  it('does not emit when goNext is called on the last page', () => {
    setInputs(3, 10, 25);
    const emissions: number[] = [];
    component.pageChange.subscribe(value => emissions.push(value));

    component.goNext();

    expect(emissions).toEqual([]);
  });

  it('emits the previous page when goPrevious is called and not on the first page', () => {
    setInputs(2, 10, 25);
    const emissions: number[] = [];
    component.pageChange.subscribe(value => emissions.push(value));

    component.goPrevious();

    expect(emissions).toEqual([1]);
  });

  it('hides itself when there are no results', () => {
    setInputs(1, 10, 0);
    expect(component.hasResults()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.paginator')).toBeNull();
  });
});
