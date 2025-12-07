export interface Song {
  id: string;
  name: string;
  file: string;
}

export const availableSongs: Song[] = [
  { id: 'greedy', name: 'Greedy', file: '/audio/greedy.mp3' },
  { id: 'woman', name: 'Woman', file: '/audio/women.mp3' },
  { id: 'trend1', name: 'Trend 1', file: '/audio/trend1.mp3' },
  { id: 'renai', name: 'Renai', file: '/audio/renai.mp3' },
];

export const beatMaps: Record<string, number[]> = {
  greedy: [0.5, 1.2, 1.9, 2.6, 3.3, 4.0, 4.7, 5.4, 6.1, 6.8],
  woman: [0.4, 1.1, 1.8, 2.5, 3.2, 3.9, 4.6, 5.3, 6.0, 6.7],
  trend1: [0.6, 1.3, 2.0, 2.7, 3.4, 4.1, 4.8, 5.5, 6.2, 6.9],
  renai: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
};

