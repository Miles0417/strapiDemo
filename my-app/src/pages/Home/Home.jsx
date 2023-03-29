import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import "../Home/Home.scss";
import { API_URL } from "../../constant";

export const Home = () => {
  const [blocks, setBlocks] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/home-page?populate[hero_text_bottom][populate]=*&populate[image_blocks][populate]=%2A`
      );
      setBlocks(response.data.data.attributes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="home">
      {blocks && (
        <div className="home_blocks_wrapper">
          <Link className="link" to="/stories">
            <div className="hero_block">
              <div className="hero_img_wrapper">
                <img
                  className="hero_img"
                  src={`${API_URL}${blocks.hero_text_bottom.hero_image.data.attributes.url}`}
                />
              </div>
              <div className="hero_text_bttm_wrapper">
                <ReactMarkdown className="hero_text_bttm">
                  {blocks.hero_text_bottom.hero_text}
                </ReactMarkdown>
                <button className="button">READ MORE</button>
              </div>
            </div>
          </Link>
          <div className="home_body">
            {blocks?.image_blocks?.map((block, i) => {
              return (
                <div key={i} className={`home_body_block_${i} block`}>
                  <a className="link" href={`${block.image_link}`}>
                    <img
                      className="block_image"
                      src={`${API_URL}${block?.image?.data?.attributes?.url}`}
                    />
                    <div className="block_linked">
                      <ReactMarkdown className="linked_text">
                        {block?.image_text}
                      </ReactMarkdown>
                      <button className="linked_button">
                        {block?.image_button_text}
                      </button>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
