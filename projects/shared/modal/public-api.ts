import { ModalOutletComponent } from './public-api';

export { ModalService } from './src/modal.service';
export { ModalController } from './src/modal.controller';

export { ModalOutletComponent } from './src/modal-outlet/modal-outlet.component';
export { ModalComponent, MODAL_DATA } from './src/modal/modal.component';

export const MODAL_COMPONENTS = [ModalOutletComponent] as const;
