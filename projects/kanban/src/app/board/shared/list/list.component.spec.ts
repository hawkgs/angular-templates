import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { CardsService } from '../../data-access/cards.service';
import { mockFetchAndStateProvider } from '../../../shared/utils/mock-fetch-state-provider';
import { ListsService } from '../../data-access/lists.service';
import { windowProvider } from '../../../../../../../dist/shared/services';
import { BoardList } from '../../../../models';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        mockFetchAndStateProvider,
        windowProvider,
        CardsService,
        ListsService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('list', new BoardList({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
