export interface LocalStorageMessage<> {
  type: 'select' | 'deselect' | 'tool-select-goals' | 'tool-interaction' | 'tool-new-buildings';
  data: any;
}
