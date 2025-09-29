"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setFilters } from "@/state";

const backgroundImages = [
  "/2.jpg", "/22.jpg", "/111.jpg", "/222.jpg", "/1111.jpg", "/1332.jpg",
  "/1333.jpg", "/3331.jpg", "/11111.jpg", "/12333.jpg", "/fff.jpg", "/ffx.jpg",
  "/fsdx.jpg", "/fsdf.jpg", "/ft4.jpg", "/hfg.jpg", "/jjj.jpg", "/kjj.jpg",
  "/kk.jpg", "/uu.jpg", "/uuu.jpg", "/vxc.jpg", "/wer.jpg", "/wew3.jpg",
  "/wq.jpg", "/ww.jpg", "/ye.jpg"
];

const HeroSection = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(bgIndex);
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bgIndex]);

  const handleLocationSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmedQuery)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features?.length) {
        const [lng, lat] = data.features[0].center;
        dispatch(setFilters({
          location: trimmedQuery,
          coordinates: [lat, lng],
        }));
        const params = new URLSearchParams({ location: trimmedQuery, lat: lat.toString(), lng });
        router.push(`/search?${params.toString()}`);
      }
    } catch (error) {
      console.error("error search location:", error);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* imagem anterior */}
      <Image
        src={backgroundImages[prevIndex]}
        alt="Background anterior"
        fill
        className="absolute inset-0 object-cover object-center transition-opacity duration-1000 opacity-0"
        style={{ zIndex: 0 }}
      />
      {/* imagem atual com fade in */}
      <Image
        src={backgroundImages[bgIndex]}
        alt="Background atual"
        fill
        className="absolute inset-0 object-cover object-center transition-opacity duration-1000 opacity-100"
        style={{ zIndex: 1 }}
      />

      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full z-20"
      >
        <div className="max-w-4xl mx-auto px-16 sm:px-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Comece sua jornada para descobrir talentos incríveis.
          </h1>
          <p className="text-xl text-white mb-8">
            Explore o universo de artistas! Descubra talentos que transformam criatividade em emoção.
          </p>

          <div className="flex justify-center">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por cidade, endereço ou nome..."
              className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12"
            />
            <Button
              onClick={handleLocationSearch}
              className="bg-secondary-500  text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-12"
            >
              Buscar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
