/* tslint:disable:no-unused-variable */
import { async, TestBed } from '@angular/core/testing';
import { TasinmazAddComponent } from './tasinmaz-add.component';
describe('TasinmazAddComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TasinmazAddComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TasinmazAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=tasinmaz-add.component.spec.js.map