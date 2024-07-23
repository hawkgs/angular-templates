export class EditorSelection {
  constructor(
    private _range: Range | undefined,
    private _text: string,
  ) {}

  getRange(): Range | undefined {
    return this._range;
  }

  toString(): string {
    return this._text;
  }
}
