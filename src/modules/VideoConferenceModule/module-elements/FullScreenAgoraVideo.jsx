/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useRef } from "react";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import NoUserVideo from "../../../assets/meet_status/novideo.svg";
function CustomFullScreenAgoraVideo({showControl=true, audioTrack, videoTrack, isUser, name, isVideoEnabled=true, isAudioEnabled=true }) {

    const videoRef = useRef(null);
      useEffect(() => {
        if (videoTrack && videoRef.current) {
          // Dapatkan MediaStreamTrack dari videoTrack
          const mediaStreamTrack = videoTrack.getMediaStreamTrack();
    
          // Buat MediaStream baru yang berisi MediaStreamTrack
          const mediaStream = new MediaStream();
          mediaStream.addTrack(mediaStreamTrack);
    
          // Assign MediaStream ke elemen video
          videoRef.current.srcObject = mediaStream;
        }
      }, [videoTrack]);
    return (
      
      <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
        {isVideoEnabled && videoTrack? ( // i change this
          <video
            className=" w-screen md:h-[93vh] h-[95vh] object-cover rounded-t-lg"
            style={{}}
            ref={videoRef}
            autoPlay
            playsInline
            muted    
          />
        ) : (
          <img src={NoUserVideo} className=" w-screen md:h-[93vh] h-[95vh] object-cover rounded-t-lg" alt="No Video" />
        )}
  
        <div className="w-full mx-2  py-2 flex items-center justify-between">
          {(!isUser && showControl )&& (
            <div className="ml-2 flex items-center space-x-4">
              <div>
                { !isVideoEnabled ? (
                  <FaVideoSlash
                    color="red"
                    className="w-6 h-auto"
                    // Logic to toggle video track on/off
                  />
                ) : (
                  <FaVideo
                    color="#00A8FF"
                    className="w-6 h-auto"
                    // Logic to toggle video track on/off
                  />
                )}
              </div>
              <div>
                {!isAudioEnabled ? (
                  <FaMicrophoneSlash
                    color="red"
                    className="w-6 h-auto"
                    // Logic to toggle audio track on/off
                  />
                ) : (
                  <FaMicrophone
                    color="#00A8FF"
                    className="w-6 h-auto"
                    // Logic to toggle audio track on/off
                  />
                )}
              </div>
            </div>
          )}
          <div className="truncate ml-auto">
            <h1 className="text-white text-sm mr-4 truncate">
              {name}
              {isUser ? ' (Anda)' : ''}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  export default CustomFullScreenAgoraVideo