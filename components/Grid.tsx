"use client";
import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import Elastic from "./ui/Elastic";

const Grid = () => {
  return (
    <section id="about">
      <BentoGrid className="w-full py-20">
        {gridItems.map((item, i) => (
          // grid placement lives on the elastic wrapper so the card can
          // sway inside its cell without disturbing the layout
          <Elastic key={i} className={item.className} strength={10}>
            <BentoGridItem
              id={item.id}
              title={item.title}
              description={item.description}
              className="h-full w-full"
              img={item.img}
              imgClassName={item.imgClassName}
              titleClassName={item.titleClassName}
              spareImg={item.spareImg}
            />
          </Elastic>
        ))}
      </BentoGrid>
    </section>
  );
};

export default Grid;
