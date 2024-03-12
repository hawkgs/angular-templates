import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

const getReuseFromRoutes = (route: ActivatedRouteSnapshot): string[] =>
  route.routeConfig?.data ? route.routeConfig.data['reuseFrom'] : [];

const isReusable = (route: ActivatedRouteSnapshot): boolean =>
  !!getReuseFromRoutes(route).length;

const getRoutePath = (route: ActivatedRouteSnapshot): string =>
  route.pathFromRoot
    .filter((r) => !!r.routeConfig)
    .map((r) => r.routeConfig!.path)
    .filter((s) => !!s)
    .join('/');

const getStoreKey = (route: ActivatedRouteSnapshot) => getRoutePath(route);

@Injectable()
export class CachedRouteReuseStrategy implements RouteReuseStrategy {
  private _cached: Map<string, DetachedRouteHandle> = new Map();
  private _lastRoutePath: string = '';

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    this._lastRoutePath = getRoutePath(route);

    return isReusable(route);
  }

  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null,
  ): void {
    const key = getStoreKey(route);

    if (handle) {
      this._cached.set(key, handle);
    } else {
      this._cached.delete(key);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const reuseFromRoutes = getReuseFromRoutes(route);
    const shouldReuse = reuseFromRoutes.includes(this._lastRoutePath);

    return shouldReuse && this._cached.has(getStoreKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this._cached.get(getStoreKey(route)) || null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
