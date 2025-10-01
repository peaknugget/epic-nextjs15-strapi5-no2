import React from "react";
import { TFeature } from "@/types";
import { FaCheck, FaClock, FaCloud } from "react-icons/fa";
export interface IFeaturesSectionProps {
  id: number;
  __component: string;
  title: string;
  description: string;
  features?: TFeature[] | null;
}

function getIcon(name: string) {
  switch (name) {
    case "CLOCK_ICON":
      return <FaClock className="w-12 h-12 mb-4 text-gray-900" />;
    case "CHECK_ICON":
      return <FaCheck className="w-12 h-12 mb-4 text-gray-900" />;
    case "CLOUD_ICON":
      return <FaCloud className="w-12 h-12 mb-4 text-gray-900" />;
    default:
      return null;
  }
}


const styles = {
  container: "flex-1",
  section: "container px-4 py-6 mx-auto md:px-6 lg:py-24",
  grid: "grid gap-8 md:grid-cols-3",
  featureCard: "flex flex-col items-center text-center",
  icon: "w-12 h-12 mb-4 text-gray-900",
  heading: "mb-4 text-2xl font-bold",
  description: "text-gray-500",
};

export function FeaturesSection({ data }: { data: IFeaturesSectionProps }) {
  if (!data?.features) return null;
  return (
    <div>
      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.grid}>
            {data.features.map((item: TFeature) => (
              <div className={styles.featureCard} key={item.id}>
                {getIcon(item.icon)}
                <h2 className={styles.heading}>{item.heading}</h2>
                <p className={styles.description}>{item.subHeading}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}