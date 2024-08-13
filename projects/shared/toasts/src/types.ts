import { IconName } from '@ngx-templates/shared/icon';

export enum ToastType {
  Default = 'default',
  Notification = 'notification',
}

export type ToastConfig = {
  ttl: number;
  type: ToastType;
  /*
   * Applicable only to ToastType.Notification
   */
  icon?: IconName;
};
