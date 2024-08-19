import { IconName } from '@ngx-templates/shared/icon';

export enum ToastType {
  /**
   * Standard small toast that appears at the top of the viewport.
   */
  Default = 'default',
  /**
   * A notification-like toast that is rendered at the bottom right
   * portion of the viewport.
   */
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
