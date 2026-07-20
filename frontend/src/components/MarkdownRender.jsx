import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default function MarkdownRender({ content, role = "model" }) {
  return (
    <article className="prose dark:prose-invert max-w-none">  
    {role == "model" ? <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
      {content}
    </ReactMarkdown>: <> {content} </>}
    </article>
  );
}