import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, combineLatest, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

import { ErrorBannerComponent } from '../../shared/ui/error-banner/error-banner.component';
import { SpinnerComponent } from '../../shared/ui/spinner/spinner.component';
import { ProductFilterBarComponent, ProductFilterValues } from '../product-filter-bar/product-filter-bar.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductPaginatorComponent } from '../product-paginator/product-paginator.component';
import { PagedResult, Product, ProductQuery } from '../product.model';
import { ProductRealtimeService } from '../product-realtime.service';
import { ProductService } from '../product.service';

const DEFAULT_PAGE_SIZE = 20;
const FILTER_DEBOUNCE_MS = 300;
const DEFAULT_PAGE = 1;
const SPLASH_DURATION_MS = 2000;

export type CatalogTab = 'add' | 'search';

interface CatalogState {
  result: PagedResult<Product> | null;
  error: string | null;
}

const INITIAL_STATE: CatalogState = { result: null, error: null };

@Component({
  selector: 'app-product-catalog-page',
  standalone: true,
  imports: [
    SpinnerComponent,
    ErrorBannerComponent,
    ProductFormComponent,
    ProductFilterBarComponent,
    ProductListComponent,
    ProductPaginatorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-catalog-page.component.html',
  styleUrl: './product-catalog-page.component.scss'
})
export class ProductCatalogPageComponent {
  private readonly productService = inject(ProductService);
  private readonly productRealtimeService = inject(ProductRealtimeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSize = signal(DEFAULT_PAGE_SIZE);
  readonly code = signal('');
  readonly name = signal('');
  readonly page = signal(DEFAULT_PAGE);
  readonly activeTab = signal<CatalogTab>('search');
  readonly splashCounter = signal(0);
  private readonly versionTrigger = signal(0);
  private splashTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly state = toSignal(this.buildQueryStream(), { initialValue: INITIAL_STATE });

  readonly products = computed(() => this.state().result?.items ?? []);
  readonly total = computed(() => this.state().result?.total ?? 0);
  readonly loading = computed(() => this.state().result === null && this.state().error === null);
  readonly error = computed(() => this.state().error);
  readonly hasActiveFilters = computed(() => this.code().length > 0 || this.name().length > 0);
  readonly emptyTitle = computed(() => this.hasActiveFilters() ? 'No matching products' : 'No products yet');
  readonly emptyDescription = computed(() =>
    this.hasActiveFilters()
      ? 'Try adjusting the Code or Name filter.'
      : 'Add the first product to see it appear here.'
  );

  constructor() {
    this.seedFromUrl();
    this.subscribeToRealtimeUpdates();
    this.destroyRef.onDestroy(() => this.clearSplashTimer());
  }

  private subscribeToRealtimeUpdates(): void {
    this.productRealtimeService.productAdded$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.versionTrigger.update(version => version + 1));
  }

  onFilterChange(values: ProductFilterValues): void {
    const codeChanged = values.code !== this.code();
    const nameChanged = values.name !== this.name();
    this.code.set(values.code);
    this.name.set(values.name);
    if (codeChanged || nameChanged) {
      this.page.set(DEFAULT_PAGE);
    }
  }

  onPageChange(page: number): void {
    this.page.set(page);
  }

  onProductAdded(): void {
    this.versionTrigger.update(version => version + 1);
    this.fireSplash();
  }

  private fireSplash(): void {
    this.clearSplashTimer();
    this.splashCounter.set(0);
    queueMicrotask(() => {
      this.splashCounter.update(counter => counter + 1);
      this.splashTimer = setTimeout(() => {
        this.splashCounter.set(0);
        this.splashTimer = null;
      }, SPLASH_DURATION_MS);
    });
  }

  private clearSplashTimer(): void {
    if (this.splashTimer !== null) {
      clearTimeout(this.splashTimer);
      this.splashTimer = null;
    }
  }

  selectTab(tab: CatalogTab): void {
    this.activeTab.set(tab);
  }

  reload(): void {
    this.versionTrigger.update(version => version + 1);
  }

  private buildQueryStream(): Observable<CatalogState> {
    const code$ = toObservable(this.code).pipe(debounceTime(FILTER_DEBOUNCE_MS), distinctUntilChanged());
    const name$ = toObservable(this.name).pipe(debounceTime(FILTER_DEBOUNCE_MS), distinctUntilChanged());
    const page$ = toObservable(this.page).pipe(distinctUntilChanged());
    const pageSize$ = toObservable(this.pageSize).pipe(distinctUntilChanged());
    const trigger$ = toObservable(this.versionTrigger);

    return combineLatest([code$, name$, page$, pageSize$, trigger$]).pipe(
      tap(([code, name, page, pageSize]) => this.syncUrl({ code, name, page, pageSize })),
      switchMap(([code, name, page, pageSize]) => {
        const query: ProductQuery = { code, name, page, pageSize };
        return this.productService.search(query).pipe(
          map((result): CatalogState => ({ result, error: null })),
          catchError(() => of<CatalogState>({ result: null, error: 'Unable to load products.' }))
        );
      }),
      takeUntilDestroyed()
    );
  }

  private seedFromUrl(): void {
    const params = this.route.snapshot.queryParamMap;
    const code = params.get('code') ?? '';
    const name = params.get('name') ?? '';
    const page = this.parsePositiveInt(params.get('page'), DEFAULT_PAGE);
    const pageSize = this.parsePositiveInt(params.get('pageSize'), DEFAULT_PAGE_SIZE);

    this.code.set(code);
    this.name.set(name);
    this.page.set(page);
    this.pageSize.set(pageSize);
  }

  private syncUrl(query: ProductQuery): void {
    const queryParams: Record<string, string | number | null> = {
      code: query.code.length > 0 ? query.code : null,
      name: query.name.length > 0 ? query.name : null,
      page: query.page,
      pageSize: query.pageSize
    };
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private parsePositiveInt(raw: string | null, fallback: number): number {
    if (raw === null) {
      return fallback;
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
  }
}

