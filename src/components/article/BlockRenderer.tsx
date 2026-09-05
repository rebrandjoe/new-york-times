import Image from "next/image";
import type { ContentBlock } from "@/lib/cms/blocks";
import { renderInlineMarkup } from "@/lib/cms/inline-markup";

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-lg leading-relaxed text-offwhite">{renderInlineMarkup(block.text)}</p>
      );

    case "heading": {
      const sizes = { 1: "text-3xl", 2: "text-2xl", 3: "text-xl" } as const;
      const Tag = (`h${block.level}`) as "h1" | "h2" | "h3";
      return (
        <Tag className={`font-serif font-extrabold text-white ${sizes[block.level]}`}>
          {renderInlineMarkup(block.text)}
        </Tag>
      );
    }

    case "list": {
      const ListTag = block.style === "numbered" ? "ol" : "ul";
      return (
        <ListTag
          className={`ml-6 space-y-2 text-lg leading-relaxed text-offwhite ${
            block.style === "numbered" ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i}>{renderInlineMarkup(item)}</li>
          ))}
        </ListTag>
      );
    }

    case "blockquote":
      return (
        <blockquote className="border-l-2 border-accent pl-5 text-lg italic leading-relaxed text-gray-secondary-light">
          {renderInlineMarkup(block.text)}
        </blockquote>
      );

    case "pullquote":
      return (
        <figure className="border-y border-charcoal py-6 text-center">
          <blockquote className="font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">
            {renderInlineMarkup(block.text)}
          </blockquote>
          {block.attribution && (
            <figcaption className="mt-3 text-sm text-gray-muted">{block.attribution}</figcaption>
          )}
        </figure>
      );

    case "image":
      return (
        <figure>
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal">
            <Image src={block.url} alt={block.alt} fill sizes="720px" className="object-cover" />
          </div>
          {(block.caption || block.credit) && (
            <figcaption className="mt-2 text-sm text-gray-muted">
              {block.caption}
              {block.caption && block.credit && " — "}
              {block.credit && <span>{block.credit}</span>}
            </figcaption>
          )}
        </figure>
      );

    case "video":
      return (
        <figure>
          <div className="aspect-video w-full overflow-hidden bg-charcoal">
            <iframe
              src={block.url}
              title={block.description ?? "Embedded video"}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
          {(block.caption || block.credit) && (
            <figcaption className="mt-2 text-sm text-gray-muted">
              {block.caption}
              {block.caption && block.credit && " — "}
              {block.credit && <span>{block.credit}</span>}
            </figcaption>
          )}
        </figure>
      );

    case "divider":
      return <hr className="border-charcoal" />;
  }
}
