import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class JwtConfigService {
  private readonly jwtConfig = {
    issuer: "gbgbgbgbg.com/",
    audience: "bgbgbgbgb.com/",
    securitykey: "bestsuperideakeystoremythebestkeystore",
  };

  getJwtConfig() {
    return this.jwtConfig;
  }
}
