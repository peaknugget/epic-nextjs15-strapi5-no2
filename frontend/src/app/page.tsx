
import { HeroSection } from "@/components/custom/hero-section";
import qs from "qs";

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
      },
    },
  },
});

async function getStrapiData(path:string) {
  const baseUrl="http://localhost:1337";

  const url = new URL(path, baseUrl);
  url.search = homePageQuery;


  try {
    const response = await fetch(`${url}`);
    const data = await response.json();
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