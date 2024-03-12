import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  Route,
  RouteReuseStrategy,
} from '@angular/router';

const LOGGING = true;

const devLog = (...args: unknown[]) => {
  if (LOGGING) {
    console.log('> CRRS:', ...args);
  }
};

const isReusable = (route: ActivatedRouteSnapshot) =>
  route.routeConfig?.data && route.routeConfig.data['reuse'];

const getStoreKey = (route: ActivatedRouteSnapshot) =>
  route.routeConfig as Route;

@Injectable()
export class CachedRouteReuseStrategy implements RouteReuseStrategy {
  private _cached: Map<Route, DetachedRouteHandle> = new Map();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    devLog('SHOULD_DETACH');
    return isReusable(route);
  }

  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null,
  ): void {
    if (handle) {
      this._cached.set(getStoreKey(route), handle);
    }
    devLog('STORE', this._cached);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    devLog('SHOULD_ATTACH');
    return this._cached.has(getStoreKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    devLog('RETRIEVE', getStoreKey(route));
    return this._cached.get(getStoreKey(route)) || null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    devLog('SHOULD_REUSE_ROUTE');
    return isReusable(future);
  }
}
