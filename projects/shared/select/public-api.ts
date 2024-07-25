import { SelectOptionComponent } from './public-api';
import { SelectComponent } from './public-api';

export { SelectComponent } from './src/select/select.component';
export { SelectOptionComponent } from './src/select-option/select-option.component';

export const SELECT_COMPONENTS = [
  SelectComponent,
  SelectOptionComponent,
] as const;
