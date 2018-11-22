export interface LocalStorageMessage<> {
  type: 'select' | 'deselect' | 'tool-select-goals' | 'tool-interaction' | 'tool-new-buildings-json' | 'tool-new-map-position' | 'tool-context';
  data: any;
}
