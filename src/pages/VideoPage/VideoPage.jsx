import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Loader } from "../../components";
import { EmptyState } from "..";

import {
  useDataContext,
  useGlobalContext,
  useAuthContext,
} from "../../context";
import { loadSingleVideo } from "../../services/videos";

import { BiDotsVertical } from "react-icons/bi";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { MdOutlineAccessTime, MdOutlineAccessTimeFilled } from "react-icons/md";
import { CgPlayListAdd } from "react-icons/cg";
import { BsPlayCircle } from "react-icons/bs";

import { addToLiked, removeFromLiked } from "../../services/likes";
import {
  addToWatchLater,
  removeFromWatchLater,
} from "../../services/watchlater";

import "./video-page.scss";

const Video = () => {
  const params = useParams();
  const navigate = useNavigate();
  const videoId = params.id;
  const [readMore, setReadMore] = useState(false);

  const {
    dataState: {
      vid: { loading, error, single_video },
      liked: { items: likedVideos },
      watchLater: { items: watchLaterVideos },
    },
    dataDispatch,
  } = useDataContext();
  const {
    globalHandlers: { openAlert },
  } = useGlobalContext();
  const {
    authState: {
      user: { token },
    },
  } = useAuthContext();

  let inLikedVideos = likedVideos.some((item) => item._id === single_video._id);
  const inWatchLater = watchLaterVideos.some(
    (item) => item._id === single_video._id
  );

  const handleLike = () => {
    if (token) {
      if (inLikedVideos) removeFromLiked(videoId, dataDispatch, openAlert);
      else addToLiked(single_video, dataDispatch, openAlert);
    } else navigate("/signin");
  };

  const handleWatchLater = () => {
    if (token) {
      if (inWatchLater) removeFromWatchLater(videoId, dataDispatch, openAlert);
      else addToWatchLater(video, dataDispatch, openAlert);
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    loadSingleVideo(videoId, dataDispatch);
  }, [dataDispatch]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <EmptyState msg={error} type="error" path="/explore" />;
  }

  const { _id, title, categoryName, creatorImg, creator, description } =
    single_video;

  return (
    <section className="video-section pad-default">
      <div className="video-section__display">
        <iframe
          className="video-section__frame"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="video-section__content">
          <div className="t-margin-md flex flex-space-between flex-center-y b-margin-sm">
            <span className="video-section__title">{title}</span>

            <ul className="video-section__menu">
              <li onClick={handleLike}>
                {inLikedVideos && token ? (
                  <AiFillLike className="item-active" />
                ) : (
                  <AiOutlineLike />
                )}
              </li>
              <li onClick={handleWatchLater}>
                {inWatchLater && token ? (
                  <MdOutlineAccessTimeFilled className="item-active" />
                ) : (
                  <MdOutlineAccessTime />
                )}
              </li>
              <li onClick={() => alert("add to playlist")}>
                <CgPlayListAdd />
              </li>
            </ul>
          </div>
          <p className="divider"></p>
          <div className="video-section__creator-details flex flex-center-y">
            <figure className="avatar avatar-lg">
              <img
                className="avatar-img"
                src={creatorImg}
                alt="creator image"
              />
            </figure>
            <p>{creator}</p>
            <span>|</span>
            <p>{categoryName}</p>
          </div>
          <p className="divider"></p>

          <p className="video-section__description">
            {readMore ? description : `${description?.substr(0, 200)}... `}
            <button
              onClick={() => setReadMore((val) => !val)}
              className="video-section__description__btn"
            >
              {readMore ? "Read Less" : "Read More"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Video;