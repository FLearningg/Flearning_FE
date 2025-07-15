import React from "react";
import "../../assets/WatchCourse/VideoPlayer.css";

const VideoPlayer = ({ videoUrl, onProgress, onEnded }) => {
  if (!videoUrl)
    return <div className="f-video-player">No video available.</div>;
  return (
    <div className="f-video-player">
      <video
        src={videoUrl}
        controls
        controlsList="nodownload"
        className="f-video"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onEnded={onEnded}
      />
    </div>
  );
};

export default VideoPlayer;
