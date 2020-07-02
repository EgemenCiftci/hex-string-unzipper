import { Component, VERSION, Input, Output, EventEmitter } from "@angular/core";
import { ungzip } from "pako";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  errorText: string;
  private validChars: string[] = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
  ];

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
    let upperCaseHexString = hexString.toUpperCase();
    for (let i = 0; i < upperCaseHexString.length; i++) {
      let char = upperCaseHexString.charAt(i);
      if (this.validChars.some(f => f === char)) {
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
