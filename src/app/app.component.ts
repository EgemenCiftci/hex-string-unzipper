import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ungzip } from "pako";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private regex = RegExp("[0-9A-Fa-f]");
  errorText: string;
  inputText = new FormControl("", [Validators.required]);
  outputText = new FormControl(""); 

  onclick() {
    try {
      this.errorText = undefined;
      this.outputText.setValue("");
      let validHexString = this.getValidHexString(this.inputText.value);
      let bytes = this.getBytes(validHexString);
      let unzippedHexString = this.unzip(bytes);
      this.outputText.setValue(unzippedHexString);
    } catch (error) {
      this.errorText = error;
      this.outputText.setValue("");
    }
  }

  getErrorMessage(): string {
    if (this.inputText.hasError("required")) {
      return "You must enter a value";
    }
    return this.errorText;
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
