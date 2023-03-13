import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import "../Stories/Stories.scss";
import axios from "axios";

export const Stories = () => {
  const [stories, setStories] = useState();
  const fetchData = async () => {
    try {
      const thumbRes = await axios.get(
        "http://localhost:1337/api/stories?populate[0]=thumbnail"
      );
      setStories(await thumbRes.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="stories">
      <div className="grid">
        {stories?.map((story, index) => {
          switch (story.attributes.thumbnail_width) {
            case "thin":
              return (
                <div key={index} className="content">
                  <Link
                    className="storyLink"
                    key={story.id}
                    to={`/stories/${story.id}`}
                  >
                    <img
                      className="content_thumbnail"
                      src={`http://localhost:1337${story?.attributes?.thumbnail?.data?.attributes?.url}`}
                    />
                    <h2 className="content_title">{story.attributes.title}</h2>
                    <ReactMarkdown className="content_description">
                      {story.attributes.description}
                    </ReactMarkdown>
                  </Link>
                </div>
              );
            case "wide":
              return (
                <div key={index} className="wide content">
                  <Link
                    className="storyLink"
                    key={story.id}
                    to={`/stories/${story.id}`}
                  >
                    <img
                      className="content_thumbnail"
                      src={`http://localhost:1337${story?.attributes?.thumbnail?.data?.attributes?.url}`}
                    />
                    <h2 className="content_title">{story.attributes.title}</h2>
                    <ReactMarkdown className="content_description">
                      {story.attributes.description}
                    </ReactMarkdown>
                  </Link>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};
