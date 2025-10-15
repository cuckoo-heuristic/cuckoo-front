import { FormBuilderModel } from "./form-builder.model";

export class FormBuilderUtils {
  convertFormBuilderToJson(data: FormBuilderModel) {
    return {
      [data.name]: {
        type: data.type,
        widget: data.widget,
        title: data.title,
        // description: data.description,
        order: data.order,
        tab: data.tab,
        place_holder: data.placeHolder,
        nullable: data.nullable,
        empty: data.nullable,
        default: data.default,
        readonly: data.readonly,
        ...(data.widget == "formula" && {
          formula: data.formula,
        }),
        ...(data.allowed && {
          allowed: data.allowed,
        }),
        geometry_type: data.geometry_type,
        visible: data.visible.isActive
          ? data.visible.field
            ? {
                field: data.visible.field,
                condition: data.visible.operator,
                value: data.visible.value,
              }
            : null
          : false,
      },
    };
  }
}
