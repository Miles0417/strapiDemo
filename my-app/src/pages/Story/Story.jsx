import axios from "axios";
import "../Story/Story.scss";
import { useEffect } from "react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

export const Story = () => {
  const [blocks, setBlocks] = useState();
  const { id } = useParams();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1337/api/stories/${id}?populate[Dynamic_constructor][populate]=%2A`
      );

      setBlocks(await response.data.data.attributes.Dynamic_constructor);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  });
  return (
    <div className="story">
      {blocks?.map((block, index) => {
        switch (block.__component) {
          case "blocks.hero-full-txt-bottom":
            return (
              <div className="story_block_wrapper">
                <div key={index} className="hero_block">
                  <div className="hero_img_wrapper">
                    <img
                      className="hero_img"
                      src={`http://localhost:1337${block?.hero_image?.data?.attributes.url}`}
                    />
                  </div>
                  <div className="hero_text_bttm_wrapper">
                    <ReactMarkdown className="hero_text_bttm">
                      {block.hero_text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          case "blocks.hero-full-txt-top":
            return (
              <div className="story_block_wrapper">
                <div key={index} className="hero_block">
                  <div className="hero_img_wrapper">
                    <img
                      className="hero_img"
                      src={`http://localhost:1337${block?.hero_image?.data?.attributes?.url}`}
                    />
                  </div>
                  <div className="hero_text_top_wrapper">
                    <ReactMarkdown className="hero_text_top">
                      {block.hero_text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );

          case "blocks.single-text":
            return (
              <div className="story_block_wrapper">
                <div key={index} className={`block ${block?.block_width}`}>
                  <div className="single_col">
                    <ReactMarkdown className="single_col_text">
                      {block.Single_text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          case "blocks.double-txt":
            return (
              <div className="story_block_wrapper">
                <div key={index} className={`block ${block?.block_width}`}>
                  <div className="left_col">
                    <ReactMarkdown className="left_col_text">
                      {block.left_col_text}
                    </ReactMarkdown>
                  </div>
                  <div className="right_col">
                    <ReactMarkdown className="right_col_text">
                      {block.right_col_text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          case "blocks.single-img":
            return (
              <div className="story_block_wrapper">
                <div key={index} className={`block ${block?.block_width}`}>
                  <div className="single_col">
                    <img
                      className="single_col_img"
                      src={`http://localhost:1337${block.Single_img.data.attributes.url}`}
                    />
                    <p>{block.Single_img_title}</p>
                  </div>
                </div>
              </div>
            );
          case "blocks.double-img":
            return (
              <div className="story_block_wrapper">
                <div key={index} className={`block ${block?.block_width}`}>
                  <div className="left_col">
                    <img
                      className="left_col_img"
                      src={`http://localhost:1337${block?.left_col_img.data.attributes.url}`}
                    />
                    <p className="left_col_img_title">
                      <em>{block.left_col_img_title}</em>
                    </p>
                  </div>
                  <div className="right_col">
                    <img
                      className="right_col_img"
                      src={`http://localhost:1337${block?.right_col_img?.data?.attributes.url}`}
                    />
                    <p className="right_col_img_title">
                      <em>{block.right_col_img_title}</em>
                    </p>
                  </div>
                </div>
              </div>
            );
          case "blocks.img-left-text-right":
            return (
              <div className="story_block_wrapper">
                <div key={index} className={`block ${block?.block_width}`}>
                  <div className="left_col">
                    <img
                      className="left_col_img"
                      src={`http://localhost:1337${block?.Img_left.data?.attributes?.url}`}
                    />
                    <p className="left_col_img_title">
                      <em>{block.img_left_title}</em>
                    </p>
                  </div>
                  <div className="right_col">
                    <ReactMarkdown className="right_col_text">
                      {block.Text_right}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          case "blocks.img-right-text-left":
            return (
              <div className="story_block_wrapper">
                <div key={index} className={`block ${block?.block_width}`}>
                  <div className="left_col">
                    <ReactMarkdown
                      className={`left_col_text ${block?.text_position}`}
                    >
                      {block.left_col_text}
                    </ReactMarkdown>
                  </div>
                  <div className="right_col">
                    <img
                      className="right_col_img"
                      src={`http://localhost:1337${block?.right_col_img.data.attributes.url}`}
                    />
                    <p className="right_col_img_title">
                      <em>{block.right_col_img_title}</em>
                    </p>
                  </div>
                </div>
              </div>
            );
        }
      })}
    </div>
  );
};
