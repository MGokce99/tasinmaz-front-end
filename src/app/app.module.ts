import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TasinmazComponent } from "./tasinmaz/tasinmaz.component";
import { NavComponent } from "./nav/nav.component";
import { TasinmazUpdateComponent } from "./tasinmaz/tasinmaz-update/tasinmaz-update.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { UsersComponent } from "./users/users.component";
import { LoginComponent } from "./login/login.component";
import { LogsComponent } from "./logs/logs.component";
import { UserAddComponent } from "./users/user-add/user-add.component";
import { UserUpdateComponent } from "./users/user-update/user-update.component";
import { LogDetailComponent } from "./logs/log-detail/log-detail.component";
import { TasinmazAddComponent } from "./tasinmaz/tasinmaz-add/tasinmaz-add.component";
import { TasinmazMapComponent } from "./tasinmaz/tasinmaz-map/tasinmaz-map.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TasinmazFilterPipe } from "./tasinmaz/tasinmaz-filter.pipe";
import { MatPaginatorModule } from "@angular/material/paginator";
import { UsersFilterPipe } from "./users/users-filter.pipe";
import { LogdetailsFilterPipe } from "./logs/log-detail/logdetails-filter.pipe";
import { LayerOpacityComponent } from "./tasinmaz/tasinmaz-map/layer-opacity/layer-opacity.component";
import { LayerToggleComponent } from "./tasinmaz/tasinmaz-map/layer-toggle/layer-toggle.component";
import { JwtInterceptor, JwtModule } from "@auth0/angular-jwt";
import { PageTitleService } from "./services/page-title.service";
import { AlertifyService } from "./services/alertify.service";
import { NotificationService } from "./services/notification.service";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./services/auth.guard";
import { AdminGuard } from "./services/admin.guard";
import { AuthRedirectGuard } from "./guards/auth-redirect.guard";
import { CookieService } from "ngx-cookie-service";
import { TestBed } from "@angular/core/testing";
import { ToastrModule } from "ngx-toastr";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TasinmazComponent,
    TasinmazMapComponent,
    NavComponent,
    LogsComponent,
    UsersComponent,
    TasinmazFilterPipe,
    TasinmazAddComponent,
    TasinmazUpdateComponent,
    UsersFilterPipe,
    UserAddComponent,
    UserUpdateComponent,
    LogDetailComponent,
    LogdetailsFilterPipe,
    NotFoundComponent,
    LayerToggleComponent,
    LayerOpacityComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    ToastrModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["https://localhost:44390"],
        blacklistedRoutes: ["example.com/examplebadroute/"],
        headerName: "Authorization",
        authScheme: "Bearer",
        skipWhenExpired: true
      }
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    PageTitleService,
    AlertifyService,
    NotificationService,
    AuthService,
    AuthGuard,
    AdminGuard,
    AuthRedirectGuard,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function tokenGetter() {
  const authService: AuthService = TestBed.get(AuthService);
  const token = authService.token;
  return token ? `Bearer ${token}` : null;
}
