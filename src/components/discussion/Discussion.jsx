import {DiscussionEmbed} from "disqus-react"
import React, { useEffect } from "react";
const Disqus = ({ post }) => {
  const disqusShortname = "isacitra"
  const disqusConfig = {
    url: "http://127.0.0.1:5000/articles/"+post._id,
    identifier: post._id, // Single post id
    title: post.title // Single post title
  }
  return (
    <div className=" text-white bg-transparent">
      <DiscussionEmbed
        shortname={disqusShortname}
        config={disqusConfig}
      />
    </div>
  )
}

const DisqusCommentsDummy = () => {
    const currentUrl = 'http://127.0.0.1:5174/article';
    const identifier = '12cdjessdxe';
    
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://isacitra.disqus.com/embed.js';
        script.setAttribute('data-timestamp', String(new Date()));
        (document.head || document.body).appendChild(script);

        // Cleanup: Remove the script when the component unmounts
        return () => {
            (document.head || document.body).removeChild(script);
        };
    }, []);

    return (
        <div>
            <div id="disqus_thread"></div>
            <noscript>
                Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
            </noscript>
        </div>
    );
};
export {Disqus, DisqusCommentsDummy};