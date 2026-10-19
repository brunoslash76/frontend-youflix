export type VideoStatus = 
  | 'awaiting_upload'
  | 'uploaded'
  | 'analyzing'
  | 'transcoding'
  | 'ready'
  | 'failed'