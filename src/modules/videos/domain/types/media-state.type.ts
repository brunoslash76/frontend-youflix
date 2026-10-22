export interface MediaState {
  paused: boolean;
  ended: boolean;
  waiting: boolean;
  currentTime: number;
  duration: number;
  bufferedEnd: number;
  volume: number;
  muted: boolean;
  playbackRate: number
}
