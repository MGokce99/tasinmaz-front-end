/* tslint:disable:no-unused-variable */
import { async, TestBed } from '@angular/core/testing';
import { TasinmazComponent } from './tasinmaz.component';
describe('TasinmazComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TasinmazComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TasinmazComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=tasinmaz.component.spec.js.map