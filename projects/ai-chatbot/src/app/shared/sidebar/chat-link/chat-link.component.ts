import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IconComponent } from '@ngx-templates/shared/icon';
import { Chat } from '../../../../model';

@Component({
  selector: 'acb-chat-link',
  standalone: true,
  imports: [RouterModule, CommonModule, IconComponent],
  templateUrl: './chat-link.component.html',
  styleUrl: './chat-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatLinkComponent {
  chat = input.required<Chat>();
  isSelected = input<boolean>(false);

  deleteChat() {
    console.log('delete chat', this.chat().id);
  }

  @HostBinding('class.selected')
  private get _isSelected() {
    return this.isSelected();
  }
}
