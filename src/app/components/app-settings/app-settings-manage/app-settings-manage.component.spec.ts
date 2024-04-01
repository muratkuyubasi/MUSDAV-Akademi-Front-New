import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSettingsManageComponent } from './app-settings-manage.component';

describe('AppSettingsManageComponent', () => {
  let component: AppSettingsManageComponent;
  let fixture: ComponentFixture<AppSettingsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSettingsManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSettingsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
