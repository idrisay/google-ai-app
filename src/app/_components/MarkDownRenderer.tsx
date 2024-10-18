import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }: {content: string}) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;
