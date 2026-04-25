import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'Nothing here yet');
    expect(fixture.componentInstance).toBeTruthy();
  });

  xit('renders the title', () => {});
  xit('omits description when not provided', () => {});
});
