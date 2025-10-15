import { Component, effect, input, Input } from "@angular/core";
import { ImageModule } from "primeng/image";

@Component({
  selector: "widget-svg",
  standalone: true,
  imports: [ImageModule],
  templateUrl: "./svg-icon.component.html",
  styleUrls: ["./svg-icon.component.scss"],
})
export class SvgIconComponent {
  color = input("#ffffff");
  @Input() src: string;
  @Input() width: string = "24";
  @Input() height: string = "24";
  style: string = "";

  hexToStyle() {
    const cssStyle = `
        width: ${this.width}px;
        height: ${this.height}px;
        background-color: ${this.color()};
        -webkit-mask: url("${this.src}") no-repeat center;
        mask: url("${this.src}") no-repeat center;`;

    return cssStyle;
  }

  constructor() {
    effect(() => {
      this.style = this.hexToStyle();
    });
  }
}
