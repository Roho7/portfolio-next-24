import { useRouter } from "next/navigation";
import React from "react";
import { ProjectType } from "../_utils/types";
import { useProject } from "../_providers/useProject";
import Image from "next/image";

function Card(props: ProjectType) {
  const router = useRouter();
  const { setActiveProjectId } = useProject();

  const handleCardClick = (link: string) => {
    setActiveProjectId(link);
    router.push(`/project/${link}`);
  };

  const imageLoader = ({
    src,
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality: number;
  }) => {
    return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => handleCardClick(props.Id)}
    >
      <div className="relative h-40 md:h-96 w-80 md:w-160 card-upper rounded-3xl overflow-hidden ">
        <div className="absolute w-full h-full z-10 bg-gradient-to-tr from-ash-900 rounded-3xl"></div>
        <Image
          src={props.Cover}
          alt=""
          fill
          loading="lazy"
          // loader={imageLoader({ src: props.Cover, width: 400, quality: 75 })}
          className="absolute h-full w-full object-cover rounded-3xl group-hover:scale-105 transition-all duration-500 ease"
          placeholder="blur"
          blurDataURL="/placeholder.png"
        />
        <div className="m-4 md:m-10 absolute bottom-0 z-20  group-hover:mx-6 md:group-hover:mx-16 transition-all ease-[cubic-bezier(.57,.21,.69,1.25)]">
          <h1 className="font-normal text-3xl md:text-4xl lg:text-8xl whitespace-nowrap">
            {props.Name}
          </h1>
          <h2 className="md:mb-2 font-display md:text-3xl">{props.Type}</h2>
          <span className=" text-white text-xs md:text-sm py-1 px-2 md:p-2 border border-white rounded-full">
            {props.Software1}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
