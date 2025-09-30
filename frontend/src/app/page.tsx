
import { HeroSection } from "@/components/custom/hero-section";
import qs from "qs";
import { getStrapiURL } from "@/lib/utils";


/**
 * Example API URL (qs.stringify로 자동 변환됨)
 * http://localhost:1337/api/home-page?populate[blocks][on][layout.hero-section][populate][image][fields][0]=url
 * &populate[blocks][on][layout.hero-section][populate][image][fields][1]=alternativeText
 * &populate[blocks][on][layout.hero-section][populate][link][populate]=true
 */
http://localhost:1337/api/home-page?populate[blocks][on][layout.hero-section][populate][image][fields][0]=url&populate[blocks][on][layout.hero-section][populate][image][fields][1]=alternativeText&populate[blocks][on][layout.hero-section][populate][link][populate]=true&populate[blocks][on][layout.features-section][populate][features][populate]=true



const homePageQuery = qs.stringify({
  populate: {
    blocks: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            link: {
              populate: true,
            },
          },
        },
        "layout.features-section": {
          populate: {
            features: {
              populate: true,
            },
          },
        },
      },
    },
  },
});

async function getStrapiData(path:string) {
  const baseUrl = getStrapiURL();
  const url = new URL(path, baseUrl);
  url.search = homePageQuery;
  console.log(" url : ", url.href);


  try {
    const response = await fetch(url.href);
    const data = await response.json();
    console.log(" ✅✅ data : ", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
  
}


export default async function Home() {
  const strapiData =await getStrapiData("/api/home-page");
  const { title, description , blocks} = strapiData.data;
  console.log(" title : ", title, " description : ", description);

  console.dir(blocks, { depth: null });

  return (
    <>
      {title && description && (
        <main className="container mx-auto py-6">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="text-xl mt-4">{description}</p>
          <HeroSection data={blocks[0]} />
        </main>
      )}
    </>
  );


}