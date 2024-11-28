const fs = require("node:fs");

async function seed() {
  const res = await fetch(
    "https://dev.to/api/articles?username=priyanshuverma&per_page=50"
  );
  const outputDir = "./content";
  const articles = await res.json();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const article of articles) {
    const fileName = article.title;

    const filePath = `./${outputDir}/${fileName}.md`;

    const res = await fetch(
      `https://dev.to/api/articles/priyanshuverma/${article.slug}`
    );
    console.log("Baking:", article.title);

    const post = await res.json();
    const content = parseMarkdownContent(post);
    fs.writeFileSync(filePath, content);
  }
}

seed();

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}

function parseMarkdownContent(post) {
  return `---
title: "${post.title}"
date: ${post.published_at}
image: "${post.social_image}"
tags:
${post.tags.map((tag) => `  - ${tag}`).join("\n")}
---

${post.body_markdown}
 `.replace(/```/g, "~~~");
}
