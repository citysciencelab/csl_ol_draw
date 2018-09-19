export interface LocalStorageMessage<> {
  type: 'select' | 'deselect' | 'tool-select-goals' | 'tool-interaction';
  data: any;
}
