"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../lib/api";
import "../../styles/pages/BlogList.css";

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/blog-posts")
      .then((res) => setPosts(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <main className="blog-list-page">
        <h1>Blog</h1>
        <div className="blog-list">
          {posts.map((post) => (
            <div key={post.slug} className="blog-list-item">
              <img src={post.coverImage} alt={post.title} />
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <a href={`/blog/${post.slug}`}>Read More</a>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
