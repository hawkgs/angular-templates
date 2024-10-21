import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLinkComponent } from './chat-link.component';

describe('ChatLinkComponent', () => {
  let component: ChatLinkComponent;
  let fixture: ComponentFixture<ChatLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
