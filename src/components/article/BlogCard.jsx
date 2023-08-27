import React from "react";

const HashtagBox = ({ hashtag }) => {
    return (
      <div className="inline-block bg-slate-900 text-white px-2 py-1 mb-2 rounded-md mr-2">
        #{hashtag}
      </div>
    );
  }
  
  const HashtagList = () => {
    const hashtags = ["React", "TailwindCSS", "WebDevelopment", "Frontend"];
  
    return (
      <div>
        {hashtags.map((tag, index) => (
          <HashtagBox key={index} hashtag={tag} />
        ))}
      </div>
    );
  }

const BlogCard = ({article, previewMaxLength}) => {
    return <div key={article.id}>
    <div className="mx-auto grid md:grid-cols-2 md:gap-4 justify-center items-start  grid-flow-row auto-rows-min mb-12">
      
        <img className=' md:max-w-lg w-full h-auto mx-auto md:rounded-lg 'src="https://image.web.id/images/react.png" alt="" />
      
      <div className="md:my-0 my-4 flex flex-col justify-center text-white h-full">
        <div className=" md:hidden lg:flex flex"> 
        <HashtagList />
        </div>
        <h1 className="lg:text-3xl md:text-xl text-2xl text-[#00A8FF] my-2">
          {article.title}
        </h1>
        <div className="mb-2 text-sm md:text-sm lg:text-base text-ellipsis">
          <div>
            <p>
              {article.content.length > previewMaxLength
                ? article.content.substring(0, previewMaxLength) + "..."
                : article.content}
            </p>
          </div>
        </div>
        <div className=" h-full mt-auto flex flex-col">
        <button className="bg-slate-950 mt-auto hover:bg-gray-950 rounded-md py-3 px-3 text-sm md:text-base max-w-[200px] text-white">
          Baca Selengkapnya
        </button>
        </div>
      </div>
    </div>
  </div>
  }
  export default BlogCard;