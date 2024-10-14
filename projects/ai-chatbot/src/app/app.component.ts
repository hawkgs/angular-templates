import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ChatbotService } from './data-access/chatbot.service';

@Component({
  selector: 'acb-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private _chatbot = inject(ChatbotService);

  ngOnInit() {
    this._chatbot.loadChats();
  }
}
