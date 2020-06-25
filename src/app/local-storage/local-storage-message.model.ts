export interface LocalStorageMessage<> {
  type: 'select' | 'deselect' | 'tool-select-goals' | 'tool-interaction' | 'tool-new-buildings-json' | 'tool-new-map-position' | 'tool-context'
    | 'draw-sent'| 'draw-image';
  data: any;
}
