import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const soundscapes = [
  { id: 'rain', name: 'Rain', src: '/sounds/rain.mp3' },
  { id: 'forest', name: 'Forest', src: '/sounds/forest.mp3' },
  { id: 'coffee-shop', name: 'Coffee Shop', src: '/sounds/coffee-shop.mp3' },
];

const Soundscapes: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSoundChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSound(event.target.value);
    setIsPlaying(false);
  };

  return (
    <motion.div
      className="soundscapes-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <select onChange={handleSoundChange} value={selectedSound || ''}>
        <option value="" disabled>Select a soundscape</option>
        {soundscapes.map((sound) => (
          <option key={sound.id} value={sound.src}>
            {sound.name}
          </option>
        ))}
      </select>
      {selectedSound && (
        <>
          <audio ref={audioRef} src={selectedSound} loop />
          <motion.button
            onClick={handlePlayPause}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <Pause /> : <Play />}
          </motion.button>
          <motion.button
            onClick={handleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default Soundscapes;
