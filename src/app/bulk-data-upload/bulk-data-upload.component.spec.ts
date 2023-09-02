import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDataUploadComponent } from './bulk-data-upload.component';

describe('BulkDataUploadComponent', () => {
  let component: BulkDataUploadComponent;
  let fixture: ComponentFixture<BulkDataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkDataUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkDataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
