import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";

interface FullScreenVideoProps {
  winner: string;
  showVideo: boolean;
  setShowVideo: any;
}

const FullScreenVideo = ({
  showVideo,
  setShowVideo,
  winner,
}: FullScreenVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playedSound, setPlayedSound] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [playFinal] = useSound(
    process.env.PUBLIC_URL + "/audio/winner transition.mp3",
  );

  useEffect(() => {
    const ref = videoRef;

    if (ref.current) {
      ref.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  });

  useEffect(() => {
    if (
      !playedSound &&
      videoRef.current &&
      videoRef.current.duration - currentTime <= 1
    ) {
      playFinal();
      setPlayedSound(true);
    }
  }, [playedSound, currentTime, playFinal]);

  const handleEndVideo = () => {
    setShowVideo(false);
    setPlayedSound(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    <div>
      {/* <button onClick={handlePlayVideo}> Play Video</button> */}
      {showVideo && (
        <div className="fullscreen-video">
          <video
            ref={videoRef}
            muted
            autoPlay
            onEnded={handleEndVideo}
            style={{
              position: "fixed",
              width: "100%",
              left: "0",
              top: "0",
              height: "100%",
              objectFit: "cover",
              zIndex: "9999",
            }}
          >
            <source
              src={
                process.env.PUBLIC_URL +
                `/videos/${winner === "" ? "tie" : winner} wins.mp4`
              }
              type="video/mp4"
            />
            Your browser does not support the video tag
          </video>
        </div>
      )}
    </div>
  );
};

export default FullScreenVideo;