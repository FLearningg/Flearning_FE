import React from 'react';
import '../../assets/WatchCourse/VideoPlayer.css';

const VideoPlayer = ({ videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", onProgress }) => {
  return (
    <div className="f-video-player">
      <video
        src={videoUrl}
        controls
        controlsList="nodownload"
        className="f-video"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default VideoPlayer; 