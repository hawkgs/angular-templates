import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

const getReuseFromRoutes = (route: ActivatedRouteSnapshot): string[] =>
  route.routeConfig?.data ? route.routeConfig.data['reuseFrom'] || [] : [];

const getRoutePath = (route: ActivatedRouteSnapshot): string =>
  route.pathFromRoot
    .filter((r) => !!r.routeConfig)
    .map((r) => r.routeConfig!.path)
    .filter((s) => !!s)
    .join('/');

// The store key is represented by the route path.
const getStoreKey = (route: ActivatedRouteSnapshot) => getRoutePath(route);

// This custom strategy allows us to reuse/cache specific pages (components)
// when navigating away from them by providing a "reuseFrom" array to your
// route config path. "reuseFrom" paths tell the strategy to reuse the
// respective route (i.e. component) when navigating from any of the listed
// route paths in the array to the target route. Of course, the route will
// be reused only if it has been previously loaded in the cache.
//
// More details about the interface:
// https://github.com/angular/angular/blob/main/packages/router/src/route_reuse_strategy.ts#L80
@Injectable()
export class CachedRouteReuseStrategy implements RouteReuseStrategy {
  private _store: Map<string, DetachedRouteHandle> = new Map();
  private _newRoutePath: string = '';

  // Note that shouldDetach is called after shouldAttach on
  // route change; therefore, we are checking the new path.
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const reuseFromRoutes = getReuseFromRoutes(route);
    const shouldReuse = reuseFromRoutes.includes(this._newRoutePath);

    return shouldReuse;
  }

  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null,
  ): void {
    const key = getStoreKey(route);

    if (handle) {
      this._store.set(key, handle);
    } else {
      this._store.delete(key);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    this._newRoutePath = getRoutePath(route);

    return this._store.has(getStoreKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this._store.get(getStoreKey(route)) || null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
