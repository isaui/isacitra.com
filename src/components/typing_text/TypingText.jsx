import React, { useState, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function TypingText({input= 'Hello World'}) {
  const [text, setText] = useState('');
  const fullText = input+"  ";
  const typingSpeed = 200;

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex === fullText.length) {
        currentIndex = 0;
        setText('');
        return;
      }
      setText(fullText.slice(0, currentIndex + 1));
      currentIndex++;
    }, typingSpeed); // Atur interval sesuai keinginan Anda
    return () => clearInterval(interval);
  }, []);


  return (
    <div className=" h-3 mb-20 px-3 sm:mb-20 md:mb-12 text-base">
      <SyntaxHighlighter language="jsx" style={darcula} lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
  wrapLines={true}   showLineNumbers= {false} customStyle={{ 
        background: 'none' , overflowX: 'hidden', height: 'auto', }}>
      {text}
    </SyntaxHighlighter>
    </div>
  );
}



export default TypingText;