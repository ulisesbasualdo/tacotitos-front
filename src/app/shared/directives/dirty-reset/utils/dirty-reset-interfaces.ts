export interface IOriginalSelect {
  positionInForm?: number;
  positionInSelectsArray?: number;
  label?: string;
  initSelectValue: string;
  initInputValue: string;
  mode: 'search' | 'find' | 'select';
}
