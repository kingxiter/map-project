"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-12 bg-white mb-16"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            Descubra
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Encontre hoje mesmo o artista da área desejada!  
          </p>
          <p className="mt-2 text-gray-500 max-w-3xl mx-auto">
            Procurar artista ideal para um serviço nunca foi tão fácil. Com nossa ferramenta de busca intuitiva, você encontra rapidamente o profissional perfeito que atende a todas as suas necessidades. Comece sua busca agora e encontre o que precisa! Desde prestadores de serviços a obras de artes. 
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
          {[
            {
              imageSrc: "/landing-icon-wand.png",
              title: "Pesquise por profissionais",
              description:
                "Navegue pela nossa ampla coleção de artistas de todas as areás na localização desejada.",
            },
            {
              imageSrc: "/landing-icon-calendar.png",
              title: "Marque sua entrevista ou entre em contato!",
              description:
                "Depois de encontrar o artista ideal, agende uma entrevista online com apenas alguns cliques.",
            },
            {
              imageSrc: "/landing-icon-heart.png",
              title: "Aproveite essa experiência",
              description:
                "Os melhores artistas do Brasil e do mundo a apenas alguns cliques de você.",
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DiscoverCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const DiscoverCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="px-4 py-12 shadow-lg rounded-lg bg-primary-50 md:h-72">
    <div className="bg-primary-700 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
      <Image
        src={imageSrc}
        width={30}
        height={30}
        className="w-full h-full"
        alt={title}
      />
    </div>
    <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
    <p className="mt-2 text-base text-gray-500">{description}</p>
  </div>
);

export default DiscoverSection;
