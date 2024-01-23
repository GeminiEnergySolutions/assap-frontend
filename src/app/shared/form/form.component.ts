import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, HostListener, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';
import { switchMap, tap } from 'rxjs';
import { AuditService } from '../services/audit.service';
import { EquipmentService } from '../services/equipment.service';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

class AuditorInfo {
  id: number = 0;
  auditId: number = 0;
  preAuditauditorName: string = '';
  preAuditauditorEmail: string = '';
  preAuditauditorPhoneNumber: string = '';
}
class GeneralClientInfo {
  id: number = 0;
  auditId: number = 0;
  preAuditclientName: string = '';
  preAuditclientPosition: string = '';
  preAuditclientEmail: string = '';
  preAuditclientPhoneNum: string = '';
  preAuditclientAddressLine1: string = '';
  preAuditclientAddressLine2: string = '';
  preAuditclientCity: string = '';
  preAuditclientState: string = '';
  preAuditclientZipCode: any = null;
  metersOnsite: any = null;
  preAuditclientBusinessName: string = '';
  buildingName: string = '';
  preAuditclientFacilityType: string = 'Convenience store';
  preAuditclientFacilityTypeOther: string = '';
  preAuditauditStartDate = new Date().toISOString();
  preAuditauditEndDate = null;
}
class Interviewee {
  id: number = 0;
  auditId: number = 0;
  preAuditintervieweeName: string = '';
  preAuditintervieweePosition: string = '';
  preAuditintervieweeEmail: string = '';
  preAuditintervieweePhoneNum: string = '';
}
class OperationHours {
  id: number = 0;
  auditId: number = 0;
  vacationDays: any = null;
  hvacFeasibility: string = 'On/Off According Operating Hours';
  mondayOpening: string = '';
  mondayClosing: string = '';
  tuesdayOpening: string = '';
  tuesdayClosing: string = '';
  wednesdayOpening: string = '';
  wednesdayClosing: string = '';
  thursdayOpening: string = '';
  thursdayClosing: string = '';
  fridayOpening: string = '';
  fridayClosing: string = '';
  saturdayOpening: string = '';
  saturdayClosing: string = '';
  sundayOpening: string = '';
  sundayClosing: string = '';
  notes: string = '';
}
class Area {
  id: number = 0;
  auditId: number = 0;
  buildingTotalArea: any = null;
  buildingConditionedArea: any = null;
}
class Age {
  id: number = 0;
  auditId: number = 0;
  yearConstructed: any = null;
  yearLightSystemInstalledOrReplaced: any = null;
  yearCoolingSystemInstalledOrReplaced: any = null;
  yearHeatingSystemInstalledOrReplaced: any = null;
  yearKitchenEquipmentInstalledOrReplaced: any = null;
}
class HvacMaintenance {
  id: number = 0;
  auditId: number = 0;
  buildingHvacMaintainenceContractType: string = 'self-maintained';
  buildingHvacMaintainenceFrequency: any = null;
  buildingHvacContractorName: string = '';
  buildingHvacContractorPhoneNum: string = '';
}
class Others {
  id: number = 0;
  auditId: number = 0;
  lightReplacementHourlyRate: any = null;
}
class GeneralSiteAccessAndNotes {
  id: number = 0;
  auditId: number = 0;
  hvacEquipmentLocation: string = '';
  buildingCompleteAccess: boolean = false;
  buildingGeneralNotes: string = '';
  issuesWithHeatingOrCooling: string = '';
  buildingSeasonalIssues: string = '';
  gasRemovalAfterRetrofit: boolean = false;
  operationLimitedCovid: boolean = false;
  numberOfUniqueRooms: any = null;
  bmsForEnergyManagement: boolean = false;
  notes: string = '';
}
class UtillityBillAnalysis {
  id: number = 0;
  auditId: number = 0;
  startDate = null;
  endDate = new Date().toISOString();
  annualSpend: any = null;
  electricUtilityCompany: string = '';
  annualElectricityUsage: any = null;
  averageElectricityCostPerkWh: any = null;
  averageElectricityDemandCostPerKW: any = null;
  monthlyElectricityServiceCharge: any = null;
  buildingElectricRateStructure: string = '';

  gasUtilityCompany: string = '';
  annualGasUsage: any = null;
  averageGasCostPerTherm: any = null;
  monthlyGasServiceCharge: any = null;
  buildingGasRateStructure: string = '';

  propaneGasUtilityCompany: string = '';
  annualPropaneGasUsage: any = null;
  averagePropaneGasCostPerGal: any = null;
  monthlyPropaneGasServiceCharge: any = null;

  oilUtilityCompany: string = '';
  annualOilUsage: any = null;
  averageOilCostPerGal: any = null;
  monthlyOilServiceCharge: any = null;
}


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  // @Input() schema!: any//Schema;
  // @Input() data: any = []//FeatureData = {};
  // @Output() saved = new EventEmitter<any>();//<FeatureData>();
  @ViewChildren('accordion') accordions!: QueryList<NgbAccordion>;

  dirty = false;
  auditorType: string = 'auditorInfo';
  // equipmentType: string = '';
  typeSchema: any = [];
  formData?: any = { data: {} };
  formType: string = '';

  auditorInfo: any = new AuditorInfo();
  // auditInfoNameList = ['Anthony Kinslow', 'David Yosuico', 'Dorian Britt'];

  generalClientInfo: any = new GeneralClientInfo();
  // genralClientInfoMonthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // genralClientInfoDayList: any = [];
  genralClientInfoFacilityType = [
    'Convenience store',
    'Convenience store with gas station',
    'Education - College or university',
    'Education - Elementary or middle school',
    'Education - High school',
    'Education - Preschool or daycare',
    'Education - Uncategorized',
    'Food Service - Bakery',
    'Food Service - Fast food',
    'Food Service - Other',
    'Food Service - Restaurant or cafeteria',
    'Grocery store or food market',
    'Health Care - Outpatient Clinic',
    'Health Care - Outpatient Diagnostic',
    'Health Care - Uncategorized',
    'Lodging - Hotel',
    'Laboratory',
    'Lodging - Motel or inn',
    'Lodging - Other',
    'Nursing Home',
    'Office - Administrative or Professional',
    'Office - Bank or other financial',
    'Office - Government',
    'Office - Medical non diagnostic',
    'Office - Mixed use',
    'Office - Other',
    'Office - Uncategorized',
    'Parking Garage',
    'Public Assembly - Arena',
    'Public Assembly - Drama theater',
    'Public Assembly - Entertainment/culture',
    'Public Assembly - Funeral home',
    'Public Assembly - Large Hall',
    'Public Assembly - Library',
    'Public Assembly - Movie Theate',
    'Public Assembly - Other',
    'Public Assembly - Recreation',
    'Public Assembly - Social/meeting',
    'Public Assembly - Uncategorized',
    'Public Safety - Courthouse',
    'Public Safety - Fire or police station',
    'Public Safety - Jailhouse',
    'Public Safety - Uncategorized',
    'Religious worship - Church',
    'Religious worship - Mosque',
    'Religious worship - Synagogue',
    'Religious worship - Other',
    'Retail - Enclosed mall',
    'Retail - Other than mall',
    'Retail - Small Box (< 50K sf)',
    'Retail - Strip shopping mall',
    'Retail - Uncategorized',
    'Retail - Vehicle dealership/showroom',
    'Service - Art/Video/Photography Studio',
    'Service - Dry-cleaning or Laun',
    'Service - Industrial shop',
    'Service - Other service',
    'Service - Post office or postal center',
    'Service - Repair shop',
    'Service - Uncategorized',
    'Service - Vehicle service/repair shop',
    'Service - Vehicle storage',
    'Transportation Terminal',
    'Vacant',
    'Warehouse - Distribution or Shipping center',
    'Warehouse - Non-refrigerated',
    'Warehouse - Refrigerated',
    'Warehouse - Self-storage',
    'Warehouse - Uncategorized',
  ];

  interviewee: any = new Interviewee();

  operationHours: any = new OperationHours();
  hvacFeasibilityList = [
    'Always On',
    'On/Off According Operating Hours',
    'Use open threshold when building open and close threshold when building closed',
  ];

  area: any = new Area();
  age: any = new Age();
  hvacMaintenance: any = new HvacMaintenance();
  others: any = new Others();
  generalSiteAccessAndNotes: any = new GeneralSiteAccessAndNotes();
  utillityBillAnalysis: any = new UtillityBillAnalysis();

  constructor(
    private auditService: AuditService,
    public equipmentService: EquipmentService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private datePipe: DatePipe
  ) {
    // this.updateTextColor();
    this.generalClientInfo.preAuditauditEndDate = '';
    this.equipmentService.equipmentSubTypeData = null;
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event: Event) {
  //   this.updateTextColor();
  // }

  formatDate(element: any) {
    this.formData.data[element.key] = !this.formData.data[element.key] && element.isDateNow ? new Date().toISOString() : this.formData.data[element.key];
    return '';
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        // tap(({ aid, zid, type, tid }) => this.equipmentType = type),
        switchMap(({ aid, zid, type, tid }) => {
          if (tid) {
            return this.equipmentService.getSingleEquipmentSubType(tid);
          } else {
            return 'o';
          }
        })
      )
      .subscribe(async (subType: any) => {
        if (subType === 'o') {
          let url;
          this.route.url.subscribe((res: any) => {
            url = res[0].path;
          });
          if (url === 'grants') {
            this.formType = 'grants';
            this.auditService.getGrantsJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema;
            });
            this.auditService.getGrantsData(this.route.snapshot.params.aid).subscribe((formData: any) => {
              if (formData) {
                this.formData = formData;
              } else {
                this.formData = { data: {} };
              }
            });
          } else if (url === 'cleanenergyhub') {
            this.formType = 'cleanenergyhub';
            this.auditService.getCleanEnergyHubJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema;
            });
            this.auditService.getCleanEnergyHubData(this.route.snapshot.params.aid).subscribe((formData: any) => {
              if (formData) {
                this.formData = formData;
              } else {
                this.formData = { data: {} };
              }
            });
          }
          else {
            this.formType = 'preAudit';
            this.auditService.getPreAuditJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema.data;
              this.generalClientInfo = new GeneralClientInfo
            });
            this.auditService.getPreAuditData(this.route.snapshot.params.aid).subscribe((formData: any) => {
              if (formData.data) {
                this.formData = formData.data;
              } else {
                this.formData = { data: {} };
              }
            });
          }
          this.equipmentService.equipmentSubTypeData = null;
        } else {
          this.formType = 'equipmentForm';
          this.equipmentService.equipmentSubTypeData = subType;
          this.equipmentService.getEquipmentTypeFormSchema(subType.type ? subType.type.id : subType.typeChild.equipmentType.id).subscribe((schema: any) => {
            this.typeSchema = schema;
          });
          this.equipmentService.getEquipmentFormDataBySubType(subType.id).subscribe((formData: any) => {
            if (formData) {
              this.formData = formData;
            } else {
              this.formData = { data: {} };
            }
          });
        }
      });
  }

  // updateTextColor() {
  //   const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   document.documentElement.style.setProperty('--text-color-light', prefersDarkMode ? '#fff' : '#000');
  //   document.documentElement.style.setProperty('--text-color-dark', prefersDarkMode ? '#000' : '#fff');
  // }

  getPercentage() {
    if (this.formType === 'preAudit') {
      this.auditService.calculatePercentage(this.route.snapshot.params.aid).subscribe((res: any) => {
        this.auditService.progressPercent = res.percentage + '%';
        this.auditService.progressPercentCEH = res.percentageCEH + '%';
      });
    } else if (this.formType === 'equipmentForm') {
      this.auditService.calculatePercentageEquipment(this.route.snapshot.params.aid, this.route.snapshot.params.tid, this.route.snapshot.params.zid).subscribe((res: any) => {
        this.auditService.equipmentTotalFields = res.equipmentTotalFields;
        this.auditService.equipmentRemainingFields = res.equipmentRemainingFields;
        this.auditService.progressPercentageEquipment = res.progressPercentageEquipment + '%';
      });
    }
  }

  save() {
    if (this.formType === 'preAudit') {
      // let aid = this.route.snapshot.params.aid;
      // this.restrictAndMergeData(aid);
      // if (this.auditorInfo.id)
      //   this.auditService.updateAuditorInfo(aid, this.auditorInfo).subscribe((res: AuditorInfo) => {
      //       this.auditorInfo = res;
      //   });
      // else
      //   this.auditService.createAuditorInfo(aid, this.auditorInfo).subscribe((res: AuditorInfo) => {
      //       this.auditorInfo = res;
      //   });
      // if (this.generalClientInfo.id)
      //   this.auditService.updateGeneralInfo(aid, this.generalClientInfo).subscribe((res: GeneralClientInfo) => {
      //       this.generalClientInfo = res;
      //   });
      // else
      //   this.auditService.createGeneralInfo(aid, this.generalClientInfo).subscribe((res: GeneralClientInfo) => {
      //       this.generalClientInfo = res;
      //   });
      // if (this.interviewee.id)
      //   this.auditService.updatePreAuditInterviewee(aid, this.interviewee).subscribe((res: Interviewee) => {
      //       this.interviewee = res;
      //   });
      // else
      //   this.auditService.createPreAuditInterviewee(aid, this.interviewee).subscribe((res: Interviewee) => {
      //       this.interviewee = res;
      //   });
      // if (this.operationHours.id)
      //   this.auditService.updatePreAuditOperationHours(aid, this.operationHours).subscribe((res: OperationHours) => {
      //       this.operationHours = res;
      //   });
      // else
      //   this.auditService.createPreAuditOperationHours(aid, this.operationHours).subscribe((res: OperationHours) => {
      //       this.operationHours = res;
      //   });
      // if (this.area.id)
      //   this.auditService.updatePreAuditArea(aid, this.area).subscribe((res: Area) => {
      //       this.area = res;
      //   });
      // else
      //   this.auditService.createPreAuditArea(aid, this.area).subscribe((res: Area) => {
      //       this.area = res;
      //   });
      // if (this.age.id)
      //   this.auditService.updatePreAuditAge(aid, this.age).subscribe((res: Age) => {
      //       this.age = res;
      //   });
      // else
      //   this.auditService.createPreAuditAge(aid, this.age).subscribe((res: Age) => {
      //       this.age = res;
      //   });
      // if (this.hvacMaintenance.id)
      //   this.auditService.updatePreaAditHVACMaintainence(aid, this.hvacMaintenance).subscribe((res: HvacMaintenance) => {
      //       this.hvacMaintenance = res;
      //   });
      // else
      //   this.auditService.createPreaAditHVACMaintainence(aid, this.hvacMaintenance).subscribe((res: HvacMaintenance) => {
      //       this.hvacMaintenance = res;
      //   });
      // if (this.others.id)
      //   this.auditService.updatePreAuditOther(aid, this.others).subscribe((res: Others) => {
      //       this.others = res;
      //   });
      // else
      //   this.auditService.createPreAuditOther(aid, this.others).subscribe((res: Others) => {
      //       this.others = res;
      //   });
      // if (this.generalSiteAccessAndNotes.id)
      //   this.auditService.updatePreAuditGeneralSiteAccessNotes(aid, this.generalSiteAccessAndNotes).subscribe((res: GeneralSiteAccessAndNotes) => {
      //       this.generalSiteAccessAndNotes = res;
      //   });
      // else
      //   this.auditService.createPreAuditGeneralSiteAccessNotes(aid, this.generalSiteAccessAndNotes).subscribe((res: GeneralSiteAccessAndNotes) => {
      //       this.generalSiteAccessAndNotes = res;
      //   });
      // if (this.utillityBillAnalysis.id)
      //   this.auditService.updateUtillityBillAnalysis(aid, this.utillityBillAnalysis).subscribe((res: UtillityBillAnalysis) => {
      //       this.utillityBillAnalysis = res;
      //   });
      // else
      //   this.auditService.createUtillityBillAnalysis(aid, this.utillityBillAnalysis).subscribe((res: UtillityBillAnalysis) => {
      //       this.utillityBillAnalysis = res;
      //   });
      if (this.formData.id) {
        this.auditService.updatePreAuditData(this.route.snapshot.params.aid, this.formData).subscribe((res: any) => {
          this.toastService.success('Form', 'Successfully saved form input');
        });
      } else {
        let objData = {
          auditId: this.route.snapshot.params.aid,
          data: this.formData.data,
        };
        this.auditService.createPreAuditData(this.route.snapshot.params.aid, objData).subscribe((res: any) => {
          // this.formData = res.data;
          this.toastService.success('Form', 'Successfully saved form input');
        });
      }
      this.getPercentage();
      // this.toastService.success('Form', 'Successfully saved form input');
    } else if (this.formType === 'grants') {
      if (this.formData.id) {
        this.auditService.updateGrantsData(this.route.snapshot.params.aid, this.formData).subscribe((res: any) => {
          this.toastService.success('Form', 'Successfully saved form input');
        });
      } else {
        let objData = {
          auditId: this.route.snapshot.params.aid,
          data: this.formData.data,
        };
        this.auditService.createGrantsData(this.route.snapshot.params.aid, objData).subscribe((res: any) => {
          this.formData = res;
          this.toastService.success('Form', 'Successfully saved form input');
        });
      }
    } else if (this.formType === 'cleanenergyhub') {
      if (this.formData.id) {
        this.auditService.updateCleanEnergyHubData(this.route.snapshot.params.aid, this.formData).subscribe((res: any) => {
          this.toastService.success('Form', 'Successfully saved form input');
        });
      } else {
        let objData = {
          auditId: this.route.snapshot.params.aid,
          data: this.formData.data,
        };
        this.auditService.createCleanEnergyHubData(this.route.snapshot.params.aid, objData).subscribe((res: any) => {
          this.formData = res;
          this.toastService.success('Form', 'Successfully saved form input');
        });
      }
      this.auditService.calculatePercentage(this.route.snapshot.params.aid).subscribe((res: any) => {
        this.auditService.progressPercent = res.percentage + '%';
        this.auditService.progressPercentCEH = res.percentageCEH + '%';
      });
    } else {
      if (this.formData.id) {
        this.equipmentService.updateEquipmentFormData(this.formData).subscribe((res: any) => {
          this.getPercentage();
          this.toastService.success('Form', 'Successfully saved form input');
        });
      } else {
        let objData = {
          auditId: this.route.snapshot.params.aid,
          zoneId: this.route.snapshot.params.zid,
          equipmentId:
            this.equipmentService.equipmentSubTypeData.type.equipment.id,
          typeId: this.equipmentService.equipmentSubTypeData.type.id,
          subTypeId: this.equipmentService.equipmentSubTypeData.id,
          data: this.formData.data,
        };
        this.equipmentService.createEquipmentFormData(objData).subscribe((res: any) => {
          this.formData = res;
          this.getPercentage();
          this.toastService.success('Form', 'Successfully saved form input');
        });
      }
    }

    // this.auditorInfoModel
    // this.saved.emit(this.data);
    this.dirty = false;
  }

  shareHvacData() {
    if (confirm("Are you sure! all hvac of current Audit will be replaced with current hvac data")) {
      let objData = {
        auditId: Number(this.route.snapshot.params.aid),
        zoneId: Number(this.route.snapshot.params.zid),
        subTypeId: Number(this.equipmentService.equipmentSubTypeData.id)
      };
      this.equipmentService.auditZoneHVAC(objData).subscribe((res: any) => {
        this.toastService.success('Success', res.message);
      });
    }
  }

  shareCEHVehicleScedule(schema: any) {
    if (confirm(`Are you sure! want to share ${schema.name} schedule?`)) {
      let objData = {
        auditId: Number(this.route.snapshot.params.aid),
        shareFrom: schema.name == 'Electric Vehicle' ? 'ev' : 'non_ev'
      };
      this.equipmentService.CEHVehicleSchedule(objData).subscribe((res: any) => {
        this.formData = res.data;
        this.toastService.success('Success', res.message);
      });
    }
  }

  isMediumPage(schema: any, element: any) {
    if (this.formType != "preAudit" && this.formType != "cleanenergyhub") return false;

    let gridSize = 'col-12';
    if (schema.name == "Electric Vehicle") {
      gridSize = element.key.includes("ev_type_1_time") || element.key.includes("ev_type_2_time") || element.key.includes("ev_type_3_time") ? 'col-6' : gridSize;
    } else if (schema.name == "Non Electric Vehicle") {
      gridSize = element.key.includes("non_ev_type_1_time") || element.key.includes("non_ev_type_2_time") || element.key.includes("non_ev_type_3_time") ? 'col-6' : gridSize;
    } else if (schema.name == "Occupied Hours") {
      gridSize = element.key.includes("hour_time_") ? 'col-6' : gridSize;
    }
    return gridSize;
  }

  restrictAndMergeData(aid: Number) {
    this.auditorInfo.auditId = Number(aid);

    let preAuditauditStartDate = this.datePipe.transform(
      this.generalClientInfo.preAuditauditStartDate,
      'yyyy-MM-dd'
    );
    this.generalClientInfo = {
      ...this.generalClientInfo,
      preAuditauditStartDate,
      auditId: Number(aid),
    };
    let preAuditauditEndDate;
    if (this.generalClientInfo.preAuditauditEndDate) {
      preAuditauditEndDate = this.datePipe.transform(
        this.generalClientInfo.preAuditauditEndDate,
        'yyyy-MM-dd'
      );
      this.generalClientInfo = {
        ...this.generalClientInfo,
        preAuditauditEndDate,
      };
    } else {
      this.generalClientInfo.preAuditauditEndDate = null;
    }

    this.interviewee.auditId = Number(aid);
    this.operationHours.auditId = Number(aid);
    this.area.auditId = Number(aid);
    this.age.auditId = Number(aid);
    this.hvacMaintenance.auditId = Number(aid);
    this.others.auditId = Number(aid);
    this.generalSiteAccessAndNotes.auditId = Number(aid);

    let preAuditUtilityBillStartDate;
    if (this.utillityBillAnalysis.startDate) {
      preAuditUtilityBillStartDate = this.datePipe.transform(
        this.utillityBillAnalysis.startDate,
        'yyyy-MM-dd'
      );
      this.utillityBillAnalysis = {
        ...this.utillityBillAnalysis,
        startDate: preAuditUtilityBillStartDate,
      };
    } else {
      this.utillityBillAnalysis.startDate = null;
    }

    let preAuditUtilityBillEndDate = this.datePipe.transform(
      this.utillityBillAnalysis.endDate,
      'yyyy-MM-dd'
    );
    this.utillityBillAnalysis = {
      ...this.utillityBillAnalysis,
      endDate: preAuditUtilityBillEndDate,
      auditId: Number(aid),
    };
  }

  changeDropDown(inputList: any[], key: string) {
    if (inputList && inputList.length) {

      const keyValue = this.formData.data[key]
      let dependentInputList = inputList.filter((a: any) => a.dependentKeyValue != keyValue)

      dependentInputList.forEach((element: any) => {

        if (this.formData.data[element.key]) {
          this.formData.data[element.key] = "";

          if (element.inputList && element.inputList.length) {
            dependentInputList.forEach((element1: any) => {

              if (this.formData.data[element1.key])
                this.formData.data[element1.key] = "";

            });
          }
        }
      });
    }

    this.setDirty();
  }

  changeCheckBox(event: any, key: string) {
    this.formData.data[key] = event.target.checked;
    this.setDirty();
  }

  setDirty() {
    this.dirty = true;
  }

  canDeactivate(): boolean {
    return !this.dirty;
  }

  onPanelChange(event: NgbPanelChangeEvent) {
    if (!event.nextState) {
      return;
    }
    const accordion: any = this.accordions.find((acc: any) => event.panelId === event.panelId);
    const panelIndex = accordion.panels.toArray().findIndex((panel: any) => panel.id === event.panelId);
    const panelTitle = accordion.panels.toArray()[panelIndex].title;

    this.getData(this.route.snapshot.params.aid, panelTitle);
  }

  getData(aid: Number, preAuditType: String) {
    if (preAuditType == "Auditor Info") {
      this.auditService.getAuditorInfo(aid).subscribe((res: any) => {
        this.auditorInfo = res ? res : new AuditorInfo;
      });
    }
    else if (preAuditType == "General Client Info") {
      this.auditService.getGeneralInfo(aid).subscribe((res: any) => {
        this.generalClientInfo = res ? res : new GeneralClientInfo;
      });
    }
    else if (preAuditType == "Interviewee") {
      this.auditService.getPreAuditInterviewee(aid).subscribe((res: any) => {
        this.interviewee = res ? res : new Interviewee;
      });
    }
    else if (preAuditType == "Occupied Hours") {
      this.auditService.getPreAuditOperationHours(aid).subscribe((res: any) => {
        this.operationHours = res ? res : new OperationHours;
      });
    }
    else if (preAuditType == "Area") {
      this.auditService.getPreAuditArea(aid).subscribe((res: any) => {
        this.area = res ? res : new Area;
      });
    }
    else if (preAuditType == "Age") {
      this.auditService.getPreAuditAge(aid).subscribe((res: any) => {
        this.age = res ? res : new Age;
      });
    }
    else if (preAuditType == "HVAC Maintenance") {
      this.auditService.getPreaAditHVACMaintainence(aid).subscribe((res: any) => {
        this.hvacMaintenance = res ? res : new HvacMaintenance;
      });
    }
    else if (preAuditType == "Others") {
      this.auditService.getPreAuditOther(aid).subscribe((res: any) => {
        this.others = res ? res : new Others;
      });
    }
    else if (preAuditType == "General Site Access and Notes") {
      this.auditService.getPreAuditGeneralSiteAccessNotes(aid).subscribe((res: any) => {
        this.generalSiteAccessAndNotes = res ? res : new GeneralSiteAccessAndNotes;
      });
    }
    else if (preAuditType == "Utillity Bill Analysis") {
      this.auditService.getUtillityBillAnalysis(aid).subscribe((res: any) => {
        this.utillityBillAnalysis = res ? res : new UtillityBillAnalysis;
      });
    }
  }
}
