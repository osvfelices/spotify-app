import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { SpeakerWaveIcon as VolumeDownIcon } from "@heroicons/react/24/outline";
import {
  PauseCircleIcon,
  SpeakerWaveIcon as VolumeUpIcon,
} from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faBackwardStep,
  faForwardStep,
  faShuffle,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentTrack = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing: ", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch the current playing track
      fetchCurrentTrack();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume <= 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 50),
    []
  );

  return (
    <div className="h-24 bg-[#181818] border-[#282824] border border-style: solid text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className=" flex items-center space-x-4">
        <img
          className="hidden md:inline h-14 w-14"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* Center */}
      <div className="flex items-center justify-evenly">
        <FontAwesomeIcon icon={faShuffle} className="button" />
        <FontAwesomeIcon
          icon={faBackwardStep}
          className="button"
          onClick={() => spotifyApi.skipToPrevious()}
        />
        {isPlaying ? (
          <PauseCircleIcon
            className="button w-10 h-10"
            onClick={handlePlayPause}
          />
        ) : (
          <FontAwesomeIcon
            icon={faCirclePlay}
            className="button w-10 h-10"
            onClick={handlePlayPause}
          />
        )}

        <FontAwesomeIcon icon={faForwardStep} className="button" />
        <FontAwesomeIcon icon={faRepeat} className="button" />
      </div>

      {/* Right */}
      <div className=" flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
