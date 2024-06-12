import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TasinmazService } from "../services/tasinmaz.service";
import { PageTitleService } from "../services/page-title.service";
import { Tasinmaz } from "../models/tasinmaz";
import { Router } from "@angular/router";
import { fromLonLat } from "ol/proj";
import { AlertifyService } from "../services/alertify.service";
import { TasinmazReportService } from "../services/tasinmaz-report.service";
import { Mahalle } from "../models/mahalle";
import { Il } from "../models/il";
import { Ilce } from "../models/ilce";
import { AuthService } from "../services/auth.service";
import { TasinmazMapComponent } from "./tasinmaz-map/tasinmaz-map.component";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-tasinmaz",
  templateUrl: "./tasinmaz.component.html",
  styleUrls: ["./tasinmaz.component.css"],
  providers: [TasinmazService, TasinmazReportService],
})
export class TasinmazComponent implements OnInit {
  @ViewChild(TasinmazMapComponent) mapComponent: TasinmazMapComponent;
  tasinmazlar: Tasinmaz[];
  currentPage = 1;
  itemsPerPage = 10;
  selectedTasinmazlarSpecific: Tasinmaz[];
  selectedTasinmazlar: Tasinmaz[] = [];
  pageSize = 10;
  pagedTasinmazlar: Tasinmaz[] = [];
  searchText: string = "";
  mahalleler: Mahalle[] = [];
  iller: Il[] = [];
  ilceler: Ilce[] = [];
  userId: number;
  tokenUserId = parseInt(this.authService.getIdentity().nameidentifier);

  tasinmazForm: FormGroup;

  constructor(
    private tasinmazService: TasinmazService,
    private tasinmazReportService: TasinmazReportService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.selectedTasinmazlar = this.tasinmazService.getSelectedTasinmazlar();
    this.selectedTasinmazlarSpecific = [];
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle("Mevcut Taşınmazlar Listesi");
    this.mapComponent.toggleTakeCoordinate();
    this.tasinmazService.getMahalleler().subscribe((mahalleler) => {
      this.mahalleler = mahalleler["data"];
    });
    this.tasinmazService.getIller().subscribe((iller) => {
      this.iller = iller["data"];
    });
    this.tasinmazService.getIlceler().subscribe((ilceler) => {
      this.ilceler = ilceler["data"];
    });
    this.userService.getUserById(this.tokenUserId).subscribe((user) => {
      this.userId = user["data"].userId;
      this.authService.updateUserName(
        user["data"].firstName + " " + user["data"].lastName
      );
      console.log(this.userId);
      this.loadTasinmazlar();
    });
  }

  loadTasinmazlar(){
    this.tasinmazService.getTasinmazByUserId(this.userId).subscribe(
      (res) => {
        if (res.success == true) {
          this.tasinmazlar = res.data;

          console.log("Tüm veriler:", this.tasinmazlar);
          this.tasinmazlar.sort((a, b) => a.parselId - b.parselId);

          this.updatePagedTasinmazlar();
          this.tasinmazlar.forEach((tasinmaz) => {
            if (tasinmaz.coorX !== null && tasinmaz.coorY !== null) {
              // sfr:147258. <=
              this.tasinmazService.setTasinmazLength(this.tasinmazlar.length);
              this.mapComponent.markTasinmazAtCoordinates([
                parseFloat(tasinmaz.coorX),
                parseFloat(tasinmaz.coorY),
              ]);
            }
          });
          this.mapComponent.toggleMapMarking();
          this.selectedTasinmazlar =
            this.tasinmazService.getSelectedTasinmazlar();
          console.log("Seçili Taşınmazlar:", this.selectedTasinmazlar);
        }else{
          this.alertifyService.error('Tablo Verileri getirilirken Hata Oluştu.');
          console.log(res.message);
        }
      }
    );
  }
  updateMapViewForSingleSelectedTasinmaz() {
    if (this.selectedTasinmazlar.length === 1) {
      // Sadece bir taşınmaz seçiliyse, bu taşınmazın koordinatlarını alın
      const selectedTasinmaz = this.selectedTasinmazlar[0];
      const coorX = parseFloat(selectedTasinmaz.coorX);
      const coorY = parseFloat(selectedTasinmaz.coorY);

      // Harita görünümünü bu taşınmazın koordinatlarına göre güncelleyin ve zoom seviyesini ayarlayın
      this.mapComponent.updateMapViewForCoordinates(coorX, coorY, 9); // Zoom seviyesini istediğiniz değere ayarlayın
    }
  }

  getIlName(ilId: number): string {
    const il = this.iller.find((item) => item.ilId === ilId);
    return il ? il.ilName : "";
  }

  getIlceName(ilceId: number): string {
    const ilce = this.ilceler.find((item) => item.ilceId === ilceId);
    return ilce ? ilce.ilceName : "";
  }

  getMahalleName(mahalleId: number): string {
    const mahalle = this.mahalleler.find(
      (item) => item.mahalleId === mahalleId
    );
    return mahalle ? mahalle.mahalleName : "";
  }

  navigateToUpdateTasinmaz() {
    if (this.selectedTasinmazlar.length === 1) {
      // Sadece bir tasinmaz seçiliyse yönlendirme yap
      const selectedTasinmaz = this.selectedTasinmazlar[0];
      this.router.navigateByUrl(
        "/tasinmaz/tasinmaz-update?id=" + selectedTasinmaz.parselId
      );
    } else {
      // Birden fazla veya hiç tasinmaz seçiliyse uyarı ver veya işlem yapma
      if (this.selectedTasinmazlar.length > 1) {
        this.alertifyService.error(
          "Lütfen Güncellemek İçin Sadece Bir Adet Taşınmaz Seçin"
        );
      } else {
        this.alertifyService.error(
          "Lütfen Güncellemek İçin Bir Taşınmaz Seçin"
        );
      }
    }
  }

  search() {
    if (this.searchText.trim() === "") {
      // Arama terimi boşsa, tüm verileri göster
      this.pagedTasinmazlar = this.tasinmazlar.slice(0, this.itemsPerPage);
    } else {
      // Arama terimi doluysa, filtrelemeyi uygula ve paginasyonu sıfırla
      const filteredTasinmazlar = this.tasinmazlar.filter((tasinmaz) => {
        return (
          this.getIlName(tasinmaz.il)
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          this.getIlceName(tasinmaz.ilce)
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          this.getMahalleName(tasinmaz.mahalleId)
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          (tasinmaz.adaNo &&
            tasinmaz.adaNo
              .toLowerCase()
              .includes(this.searchText.toLowerCase())) ||
          (tasinmaz.parselNo &&
            tasinmaz.parselNo
              .toLowerCase()
              .includes(this.searchText.toLowerCase())) ||
          (tasinmaz.nitelik &&
            tasinmaz.nitelik
              .toLowerCase()
              .includes(this.searchText.toLowerCase())) ||
          (tasinmaz.adres &&
            tasinmaz.adres
              .toLowerCase()
              .includes(this.searchText.toLowerCase()))
        );
      });
      this.pagedTasinmazlar = filteredTasinmazlar.slice(0, this.itemsPerPage);
    }
    // Sayfa numarasını sıfırla
    this.currentPage = 1;
  }

  changePage(event) {
    this.currentPage = event.pageIndex + 1;
    this.updatePagedTasinmazlar();

    this.selectedTasinmazlar = [];
    this.selectedTasinmazlarSpecific = [];
    this.tasinmazService.setSelectedTasinmazlar(this.selectedTasinmazlar);
  }

  onCheckboxClicked(event: any, tasinmaz: Tasinmaz) {
    if (event.target.checked) {
      console.log(tasinmaz);
      this.selectedTasinmazlar.push(tasinmaz);
      this.selectedTasinmazlarSpecific.push(tasinmaz);
      this.tasinmazService.setSelectedTasinmazlar(this.selectedTasinmazlar);
      this.updateMapViewForSingleSelectedTasinmaz();

      console.log(this.selectedTasinmazlar[0].parselId);
    } else {
      // Seçili değilse, seçili taşınmazları çıkarın
      const index = this.selectedTasinmazlar.findIndex(
        (item) => item.parselId === tasinmaz.parselId
      );
      if (index !== -1) {
        this.selectedTasinmazlar.splice(index, 1);
        this.selectedTasinmazlarSpecific.splice(index, 1); // İlgili taşınmazı özel listeden çıkarın
        this.tasinmazService.setSelectedTasinmazlar(this.selectedTasinmazlar);
        this.mapComponent.resetZoom();
      }
    }
  }

  generateReport() {
    if (this.selectedTasinmazlar.length < 1) {
      this.alertifyService.error(
        "Lütfen Raporlamak İçin En Az Bir Taşınmaz Seçin"
      );
      return;
    }
    const dataToExport = this.selectedTasinmazlar.map((tasinmaz) => {
      return {
        ID: tasinmaz.parselId,
        İL: this.getIlName(tasinmaz.il),
        İLÇE: this.getIlceName(tasinmaz.ilce),
        MAHALLE: this.getMahalleName(tasinmaz.mahalleId),
        ADA: tasinmaz.adaNo,
        PARSEL: tasinmaz.parselNo,
        NİTELİK: tasinmaz.nitelik,
        ADRES: tasinmaz.adres,
        X: tasinmaz.coorX,
        Y: tasinmaz.coorY,
      };
    });
    this.tasinmazReportService.exportToExcel(dataToExport, "tasinmazlar_rapor");
    this.alertifyService.success(
      "Taşınmaz Bilgi Raporları Başarıyla İletildi"
    );
  }

  deleteSelectedTasinmaz() {
    if (this.selectedTasinmazlar.length > 0) {
      this.alertifyService.confirm(
        "DİKKAT!",
        "Seçili taşınmaz veya taşınmazlara ait tüm bilgileri silmek istediğinize emin misiniz?",
        () => {
          // Kullanıcı Evet'i tıkladığında yapılacak işlemler
          this.selectedTasinmazlar.forEach((tasinmaz) => {
            // Seçili taşınmazları sil
            this.tasinmazService.deleteTasinmaz(tasinmaz.parselId).subscribe(
              () => {
                this.tasinmazlar = this.tasinmazlar.filter(
                  (item) => item.parselId !== tasinmaz.parselId
                );
                this.updatePagedTasinmazlar();
                this.mapComponent.unmarkTasinmazAtCoordinates(
                  parseFloat(tasinmaz.coorX),
                  parseFloat(tasinmaz.coorY)
                );
                this.mapComponent.refreshMap();
                this.alertifyService.success(
                  "Taşınmaz Silme İşlemi Başarıyla Gerçekleşti"
                );
                console.log(
                  `Taşınmaz ID ${tasinmaz.parselId} Başarıyla Silindi`
                );
              },
              (error) => {
                console.error(
                  `Taşınmaz ID ${tasinmaz.parselId} Silinemedi: `,
                  error
                );
                this.alertifyService.error("Taşınmaz Silme İşlemi Başarısız");
              }
            );
          });

          this.selectedTasinmazlar = [];
          this.selectedTasinmazlarSpecific = []; // Özel listeden de seçili taşınmazları çıkarın
        },
        () => {
          // Kullanıcı Hayır'ı tıkladığında yapılacak işlemler
          this.alertifyService.warning("Taşınmaz Silme İşlemini İptal Ettiniz");
        }
      );
    } else {
      alert("Lütfen Silmek İçin En Az Bir Taşınmaz Seçin");
    }
  }

  updatePagedTasinmazlar() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedTasinmazlar = this.tasinmazlar.slice(startIndex, endIndex);
  }
}
