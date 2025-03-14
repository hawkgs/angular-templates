import { ToastOutletComponent } from './src/toast-outlet/toast-outlet.component';

export { ToastOutletComponent } from './src/toast-outlet/toast-outlet.component';
export { ToastsService } from './src/toasts.service';
export { type ToastConfig, ToastType } from './src/types';

export const TOASTS_COMPONENTS = [ToastOutletComponent] as const;
