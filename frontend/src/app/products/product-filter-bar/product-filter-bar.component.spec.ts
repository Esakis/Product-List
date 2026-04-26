import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProductFilterBarComponent, ProductFilterValues } from './product-filter-bar.component';

const CLEAR_FADE_DURATION_MS = 400;

describe('ProductFilterBarComponent', () => {
  let fixture: ComponentFixture<ProductFilterBarComponent>;
  let component: ProductFilterBarComponent;
  let componentRef: ComponentRef<ProductFilterBarComponent>;
  let emissions: ProductFilterValues[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFilterBarComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('code', '');
    componentRef.setInput('name', '');
    emissions = [];
    component.filterChange.subscribe(value => emissions.push(value));
    fixture.detectChanges();
  });

  it('emits the new code with the existing name when code input changes', () => {
    componentRef.setInput('name', 'tea');
    fixture.detectChanges();

    component.onCodeInput('PRD-001');

    expect(emissions).toEqual([{ code: 'PRD-001', name: 'tea' }]);
  });

  it('emits the new name with the existing code when name input changes', () => {
    componentRef.setInput('code', 'PRD');
    fixture.detectChanges();

    component.onNameInput('coffee');

    expect(emissions).toEqual([{ code: 'PRD', name: 'coffee' }]);
  });

  it('clears both fields and emits empty values when there are active filters', fakeAsync(() => {
    componentRef.setInput('code', 'PRD');
    componentRef.setInput('name', 'coffee');
    fixture.detectChanges();

    component.clear();
    tick(CLEAR_FADE_DURATION_MS);

    expect(emissions).toEqual([{ code: '', name: '' }]);
  }));

  it('does not emit when clear is called with no active filters', fakeAsync(() => {
    component.clear();
    tick(CLEAR_FADE_DURATION_MS);

    expect(emissions).toEqual([]);
  }));

  it('reports active filters when either code or name is non-empty', () => {
    componentRef.setInput('code', '');
    componentRef.setInput('name', '');
    fixture.detectChanges();
    expect(component.hasActiveFilters()).toBeFalse();

    componentRef.setInput('code', 'PRD');
    fixture.detectChanges();
    expect(component.hasActiveFilters()).toBeTrue();
  });
});
