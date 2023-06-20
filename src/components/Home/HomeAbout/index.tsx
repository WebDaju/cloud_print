import Image from "next/image";
import React from "react";

const HomeAbout = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full md:w-3/5 mx-auto mt-12 items-center">
      <figure>
        <Image
          src={"/images/homeIntroSecond.png"}
          alt="printerCloudPrint"
          width={600}
          height={400}
          layout="responsive"
          loading="lazy"
        />
      </figure>
      <article>
        <h1 className="text-4xl font-bold relative leading-10">
          About Us
          <span
            className="absolute bottom-0 left-0 w-10 h-1 bg-green-500 mt-1"
            style={{ display: "block" }}
          ></span>
        </h1>

        <p className="font-normal text-xs text-justify mt-3">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </p>
      </article>
    </section>
  );
};

export default HomeAbout;
