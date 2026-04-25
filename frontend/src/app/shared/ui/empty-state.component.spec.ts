import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    }).compileComponents();
  });

  it('renders the title', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'Nothing here yet');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.empty-state__title')?.textContent).toBe('Nothing here yet');
  });

  it('omits the description when not provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'Nothing');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.empty-state__description')).toBeNull();
  });

  it('renders the description when provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'Nothing');
    fixture.componentRef.setInput('description', 'Add the first product.');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.empty-state__description')?.textContent).toBe('Add the first product.');
  });
});
