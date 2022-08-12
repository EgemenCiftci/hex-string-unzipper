import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import * as pako from 'pako';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private regex = RegExp('[0-9A-Fa-f]');
  inputText = new FormControl('', [Validators.required]);
  outputText = new FormControl('');

  public constructor(private titleService: Title) {
    this.titleService.setTitle('Hex String Unzipper');
  }

  onUnzipShowClick() {
    try {
      this.outputText.setValue('');
      const validHexString = this.getValidHexString(this.inputText.value);
      const bytes = this.getBytes(validHexString);
      console.log(bytes);
      const unzipped = this.unzipToString(bytes);
      console.log(unzipped);
      this.outputText.setValue(unzipped);
    } catch (error) {
      this.inputText.hasError(error);
      this.outputText.setValue('');
    }
  }

  onUnzipDownloadClick() {
    try {
      this.outputText.setValue('');
      const validHexString = this.getValidHexString(this.inputText.value);
      const bytes = this.getBytes(validHexString);
      const unzipped = this.unzipToBytes(bytes);
      this.download(unzipped);
    } catch (error) {
      this.inputText.hasError(error);
      this.outputText.setValue('');
    }
  }

  getErrorMessage(): string {
    if (this.inputText.hasError('required')) {
      return 'Required';
    } else {
      return '';
    }
  }

  getValidHexString(hexString: string): string {
    let validHexString = '';
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

  unzipToString(bytes: number[]): string {
    return pako.ungzip(bytes, { to: 'string' }) as string;
  }

  unzipToBytes(bytes: number[]): Uint8Array {
    return pako.ungzip(bytes) as Uint8Array;
  }

  download(bytes: Uint8Array, fileName: string = 'download.bin') {
    if (bytes) {
      let element = document.createElement('a');
      element.href = window.URL.createObjectURL(
        new Blob([bytes], { type: 'application/octet-stream' })
      );
      element.download = fileName;
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }
}
