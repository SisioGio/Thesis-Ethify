const generateSitemap = async (products) => {
  const { writeFileSync } = require("fs");
  const host = "http://localhost:3000";

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${host}</loc>
    </url>
    <url>
        <loc>${host}/about</loc>
    </url>
    <url>
        <loc>${host}/how-to</loc>
    </url>
 
    ${products
      .map((page) => {
        return `
          <url>
              <loc>${host}/product/${encodeURI(page.name)}}</loc>
          </url>
        `;
      })
      .join("")}
   
</urlset>
`;

  writeFileSync(
    "/home/alessio/Documents/TIN/TIN TASK 10/client/public/sitemap.xml",
    sitemap
  );
  console.log("genarated Sitemap successfully");
  return true;
};

module.exports = generateSitemap;
