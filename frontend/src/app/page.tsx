import { Button } from "@/components/ui/button";


async function getStrapiData(url:string) {
  const baseUrl="http://localhost:1337";
  try {
    const response = await fetch(`${baseUrl}${url}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
  
}


export default async function Home() {
  const strapiData =await getStrapiData("/api/home-page");

  const { title, description } = strapiData.data;

  console.log(" title : ", title, " description : ", description);
  return (
    <>
      {title && description && (
        <main className="container mx-auto py-6">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="text-xl mt-4">{description}</p>
        </main>
      )}
    </>
  );


}