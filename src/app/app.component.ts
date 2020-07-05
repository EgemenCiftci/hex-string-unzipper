import { Component, VERSION, Input, Output, EventEmitter } from "@angular/core";
import { ungzip } from "pako";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private regex = RegExp("[0-9A-Fa-f]");
  errorText: string;
  private inputTextValue = "";
  @Output() inputTextChange = new EventEmitter<string>();
  @Input()
  get inputText(): string {
    return this.inputTextValue;
  }
  set inputText(val: string) {
    if (val !== this.inputTextValue) {
      this.inputTextValue = val;
      this.inputTextChange.emit(this.inputTextValue);
    }
  }

  private outputTextValue: string;
  @Output() outputTextChange = new EventEmitter<string>();
  @Input()
  get outputText(): string {
    return this.outputTextValue;
  }
  set outputText(val: string) {
    if (val !== this.outputTextValue) {
      this.outputTextValue = val;
      this.outputTextChange.emit(this.outputTextValue);
    }
  }

  onclick() {
    try {
      this.errorText = undefined;
      this.outputText = undefined;
      let validHexString = this.getValidHexString(this.inputText);
      let bytes = this.getBytes(validHexString);
      let unzippedHexString = this.unzip(bytes);
      this.outputTextValue = unzippedHexString;
    } catch (error) {
      this.errorText = error;
      this.outputText = undefined;
    }
  }

  getValidHexString(hexString: string): string {
    let validHexString = "";
    for (let i = 0; i < hexString.length; i++) {
      let char = hexString.charAt(i);
      if (this.regex.test(char)) {
        validHexString += char;
      }
    }
    return validHexString;
  }

  getBytes(hexString: string): number[] {
    let result: number[] = [];
    while (hexString.length >= 2) {
      result.push(parseInt(hexString.substring(0, 2), 16));
      hexString = hexString.substring(2, hexString.length);
    }
    return result;
  }

  unzip(bytes: number[]): string {
    return ungzip(bytes, { to: "string" });
  }
}
