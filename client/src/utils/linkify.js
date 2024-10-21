const linkifyContent = (content, color = "blue") => {
  const urlPattern =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  // Replace URLs in the content with clickable <a> elements
  const linkifiedContent = content.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:${color}; text-decoration:underline">${url}</a>`;
  });

  return linkifiedContent;
};

export default linkifyContent;
