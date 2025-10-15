import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  FormBuilderReactiveForm,
  GEOMETRYTYPE,
} from "@formbuilder/form-builder.model";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { Dialog } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { Popover, PopoverModule } from "primeng/popover";
import { Ripple } from "primeng/ripple";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import {
  FormBuilderOperator,
  FormBuilderReactiveFormVisibleField,
  FORMBUILDERTYPE,
  FormBuilderTypes,
} from "../form-builder.model";

@Component({
  selector: "app-form-builder-config",
  imports: [
    Ripple,
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    CheckboxModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    PopoverModule,
    TableModule,
    ToolbarModule,
    Dialog,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./form-builder-config.component.html",
  styleUrl: "./form-builder-config.component.scss",
})
export class FormBuilderConfigComponent implements OnInit {
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  private ref = inject(DynamicDialogRef);
  @ViewChild("tabTemplate") tabTemplate: Popover;
  @Input() fieldsList: {
    name: string;
    title: string;
  }[] = [];
  @Input() data;
  @Input() tabs: {
    title: string;
    order: number;
  }[] = [
    // {
    //   title: "تب ۱",
    //   order: 1,
    // },
    // {
    //   title: "تب ۲",
    //   order: 2,
    // },
  ];
  selectedTabs = [];
  tabDialog: boolean = false;
  formBuilderForm = new FormGroup<FormBuilderReactiveForm>({
    name: new FormControl("", [Validators.required]),
    title: new FormControl("", [Validators.required]),
    type: new FormControl("string", [Validators.required]),
    widget: new FormControl("string"),
    readonly: new FormControl(false),
    nullable: new FormControl(true),
    placeHolder: new FormControl(""),
    default: new FormControl(""),
    geometry_type: new FormControl("Point"),
    description: new FormControl(""),
    allowed: new FormControl(""),
    formula: new FormControl(""),
    visible: new FormGroup({
      isActive: new FormControl(false),
      field: new FormControl(""),
      operator: new FormControl("equal"),
      value: new FormControl(""),
    }),
    tab: new FormControl(""),
    order: new FormControl(1),
  });

  tabForm = new FormGroup({
    title: new FormControl("", [Validators.required]),
  });

  loading: boolean = false;
  widgets = [];
  operators: FormBuilderOperator[] = [
    {
      title: this.translateService.instant("FormBuilder.EqualTo"),
      value: "equal",
    },
    {
      title: this.translateService.instant("FormBuilder.NotEmpty"),
      value: "not_empty",
    },
  ];
  selectPlaceHolder = `[
{
    "label":"label1", "value": "value1"
    },
    {
    "label":"label2", "value": "value2"
    }
]`;

  types = FORMBUILDERTYPE;
  geometry = GEOMETRYTYPE;
  ngOnInit(): void {
    this.widgets = this.getWidgets(
      this.getControl("type").value as FormBuilderTypes
    );
    this.getControl("type").valueChanges.subscribe(
      (value: FormBuilderTypes) => {
        this.widgets = this.getWidgets(value);
        this.getControl("widget").setValue(this.widgets[0].name);
      }
    );
    this.getVisibleControl("isActive").valueChanges.subscribe(
      (value: boolean) => {
        if (!value) {
          // this.getVisibleControl("field").clearValidators();
          // this.getVisibleControl("operator").clearValidators();
          // this.getVisibleControl("value").clearValidators();
          this.getControl("visible").patchValue({
            field: null,
            operator: "equal",
            value: "",
          } as any);
        } else {
          // this.getVisibleControl("field").addValidators([Validators.required]);
          // this.getVisibleControl("value").addValidators([Validators.required]);
          // this.getVisibleControl("operator").addValidators([
          //   Validators.required,
          // ]);
        }
      }
    );
    if (this.data) {
      this.formBuilderForm.patchValue(this.data);
    }
  }

  getControl(key: keyof FormBuilderReactiveForm) {
    return this.formBuilderForm.get(key);
  }

  getVisibleControl(key: keyof FormBuilderReactiveFormVisibleField) {
    return this.getControl("visible").get(key);
  }

  get visible() {
    return this.getControl("visible").value;
  }

  getWidgets(value: FormBuilderTypes) {
    const widget = this.types.find((type) => type.type == value).widgets;
    return widget;
  }

  openNew(event) {
    this.tabDialog = true;
    this.tabForm.reset();
    this.tabTemplate.toggle(event);
  }

  editTab() {
    this.tabs.forEach((tab, index) => {
      tab.order = index + 1;
    });
  }

  saveTab(tab = undefined) {
    let tabFidned = this.tabs.find(
      (item) => item.title == (tab?.title || this.tabForm.value.title)
    );
    if (tab) {
      tabFidned.title = this.tabForm.value.title;
      this.tabDialog = false;
    } else {
      if (tabFidned) {
        this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("FormBuilder.Error"),
          detail: this.translateService.instant("TabExistWithTitle"),
        });
      } else {
        this.tabs.push({
          title: this.tabForm.value.title,
          order: this.tabs.length + 1,
        });
      }
      this.tabDialog = false;
    }
  }

  updateTab(tab) {
    this.tabForm.patchValue(tab);
  }

  deleteSelectedTabs() {
    this.tabs = this.tabs.filter((val) => !this.selectedTabs?.includes(val));
    this.selectedTabs = null;
    this.editTab();
  }

  submit() {
    this.ref.close({
      formData: this.formBuilderForm.value,
      tabs: this.tabs,
    });
  }
}
