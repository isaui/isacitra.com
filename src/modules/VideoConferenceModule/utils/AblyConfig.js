import Ably from 'ably/build/ably-webworker.min';

export const ably = new Ably.Realtime({
    key: 'o7gv-w.ulW0zw:olcD9FroY5pv3a9EhFzb4X7Hth-nedgovu4bdz8bsFI'
  })
export const roomChannel = ably.channels.get('room-channel')