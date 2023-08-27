
function extractParagraphs(htmlContent, maxCharacterCount) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const paragraphs = doc.querySelectorAll('p');
  
  let extractedContent = '';
  let totalCharacters = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraphText = paragraphs[i].textContent;
    if (totalCharacters + paragraphText.length <= maxCharacterCount) {
      extractedContent += paragraphText + ' ';
      totalCharacters += paragraphText.length;
    } else {
      const remainingCharacters = maxCharacterCount - totalCharacters;
      extractedContent += paragraphText.substring(0, remainingCharacters) + '...';
      break;
    }
  }
  
  return extractedContent.trim();
}

  export {extractParagraphs}