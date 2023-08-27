import React from 'react';

const ArticleLabel = ({ label }) => {
    console.log(label)
    return (
        <div className="inline-block px-3 py-1 mx-1 text-xs border border-white border-spacing text-gray-100 rounded-2xl mr-2 mb-2 transition duration-300 hover:border-neutral-600 hover:text-neutral-600">
            {label}
        </div>
    );
};

const ArticleLabelTypeString = ({ label }) => {
    return (
        <div className="inline-block py-1 px-1 md:px-2 lg:px-3 text-xs font-normal text-[#C8E4B2] rounded-sm border border-[#C8E4B2] type-string-label mr-1 mb-2">
            {label}
        </div>
    );
};

const ArticleLabelsGroup = ({data}) => {
    return (
    <div className=' inline-block'>
        {data.map((label, index) => {
            console.log(label.name)
           return <> <ArticleLabel key={index} label={label.name}/></>
        })}
    </div>
    )
}

const ArticleLabelsGroupString = ({data}) => {
    return (
    <div className=' inline-block'>
        {data.map((label, index) => <> <ArticleLabelTypeString key={index} label={label.name}/></>)}
    </div>
    )}

export {ArticleLabel, ArticleLabelsGroup, ArticleLabelsGroupString};