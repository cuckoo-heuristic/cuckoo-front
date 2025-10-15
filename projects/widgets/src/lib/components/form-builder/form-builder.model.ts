import { FormControl, FormGroup } from "@angular/forms";

export type FormBuilderTypes = "string" | "number" | "boolean" | "file";
export interface FormBuilder {
  title: string;
  type: FormBuilderTypes;
  widgets: {
    title: string;
    name: string;
  }[];
}

export interface FormBuilderModel {
  name: string;
  title: string;
  type: FormBuilderTypes;
  widget: string;
  readonly: boolean;
  nullable: boolean;
  default: string;
  placeHolder: string;
  description: string;
  allowed: string;
  geometry_type?: GeometryType;
  visible: FormBuilderVisibleModel;
  formula?: string;
  order: number;
  tab: string;
}

export interface FormBuilderVisibleModel {
  isActive: boolean;
  field: string;
  operator: "equal" | "empty" | "not_empty";
  value: string;
}

export interface FormBuilderReactiveForm {
  name: FormControl<string>;
  title: FormControl<string>;
  type: FormControl<FormBuilderTypes>;
  widget: FormControl<string>;
  readonly: FormControl<boolean>;
  nullable: FormControl<boolean>;
  default: FormControl<string>;
  placeHolder: FormControl<string>;
  description: FormControl<string>;
  allowed: FormControl<string>;
  visible: FormGroup<FormBuilderReactiveFormVisibleField>;
  geometry_type: FormControl<GeometryType>;
  tab: FormControl<string>;
  order: FormControl<number>;
  formula: FormControl<string>;
}

export interface FormBuilderReactiveFormVisibleField {
  isActive: FormControl<boolean>;
  field: FormControl<string>;
  operator: FormControl<string>;
  value: FormControl<string>;
}
export type GeometryType =
  | "Point"
  | "MultiPoint"
  | "LineString"
  | "MultiLineString"
  | "Polygon"
  | "MultiPolygon";

export const GEOMETRYTYPE: { name: GeometryType; title: string }[] = [
  {
    name: "Point",
    title: "Point",
  },
  {
    name: "MultiPoint",
    title: "MultiPoint",
  },
  {
    name: "LineString",
    title: "LineString",
  },
  {
    name: "MultiLineString",
    title: "MultiLineString",
  },
  {
    name: "Polygon",
    title: "Polygon",
  },
  {
    name: "MultiPolygon",
    title: "MultiPolygon",
  },
];

export interface FormBuilderOperator {
  title: string;
  value: "equal" | "empty" | "not_empty";
}

export const FORMBUILDERTYPE: FormBuilder[] = [
  {
    title: "رشته متنی",
    type: "string",
    widgets: [
      {
        name: "string",
        title: "string",
      },
      {
        name: "textarea",
        title: "textarea",
      },
      {
        name: "select",
        title: "select",
      },
      {
        name: "link",
        title: "link",
      },
      {
        name: "datetime",
        title: "datetime",
      },
      {
        name: "date",
        title: "date",
      },
      {
        name: "time",
        title: "time",
      },
      {
        name: "geometry",
        title: "Geometry",
      },
      {
        name: "formula",
        title: "فیلد محاسباتی",
      },
    ],
  },
  {
    title: "عددی",
    type: "number",
    widgets: [
      {
        name: "number",
        title: "number",
      },
      {
        name: "select",
        title: "select",
      },
      {
        name: "formula",
        title: "فیلد محاسباتی",
      },
    ],
  },
  {
    title: "boolean",
    type: "boolean",
    widgets: [
      {
        name: "checkbox",
        title: "checkbox",
      },
    ],
  },
  {
    title: "فایل",
    type: "file",
    widgets: [
      {
        name: "upload_file",
        title: "upload_file",
      },
    ],
  },
];
