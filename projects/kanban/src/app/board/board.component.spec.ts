import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { windowProvider } from '@ngx-templates/shared/services';

import { BoardComponent } from './board.component';
import { mockFetchAndStateProvider } from '../shared/utils/mock-fetch-state-provider';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardComponent],
      providers: [provideRouter([]), mockFetchAndStateProvider, windowProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
