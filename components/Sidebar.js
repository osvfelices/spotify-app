import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  HeartIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import Image from "next/image";
import Spotify_Logo_White from '../assets/Spotify_Logo_White.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass, faLinesLeaning, faSquarePlus, faHeart } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const spotifyApi = useSpotify();
  const {data: session, status} = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  // console.log( "you pick the playlist: ", playlistId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  } , [session, spotifyApi]);

  console.log(playlists);


  return (
    <div className="text-white p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm_max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
      <div className="space-y-4">
      <div className="flex items-center space-x-2 w-36 mb-12">
        <Image src={Spotify_Logo_White}/>
      </div>
        <button className="flex items-center space-x-2 hover:text-white">
          <FontAwesomeIcon icon={faHouse} className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <FontAwesomeIcon icon={faLinesLeaning} className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <FontAwesomeIcon icon={faSquarePlus} className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists... */}
        {playlists.map((playlist) => (
          <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">{playlist.name}</p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
