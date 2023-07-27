// trackContext.js
import { createContext, useState } from 'react';

const TrackContext = createContext();

export function TrackProvider({ children }) {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <TrackContext.Provider value={{ selectedTrack, setSelectedTrack }}>
      {children}
    </TrackContext.Provider>
  ); 
}

export default TrackContext;