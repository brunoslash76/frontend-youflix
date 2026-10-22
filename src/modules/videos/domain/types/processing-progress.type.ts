export type RenditionStatus = 'pending' | 'encoding' | 'ready' | 'failed';

export interface ProcessingProgress {
  percent: number;
  done: boolean;
  renditions: {
    name: string;
    status: RenditionStatus;
    progress: number
  }[]
}
