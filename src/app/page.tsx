"use client";

import { Box } from "@/components/Box";
import { ModeToggle } from "@/components/ui/Modtoggler";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [selectedBox, setSelectedBox] = useState<number>(1);
  const [searchResult, setSearchResult] = useState<{
    results: string[];
    duration: number;
  }>();
  useEffect(() => {
    const fetchDataFromHono = async () => {
      const fetchUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
      if (!input) return;
      setSearchResult(undefined);
      const res = await fetch(`${fetchUrl}${input}`);
      const data = (await res.json()) as {
        results: string[];
        duration: number;
      };
      setSearchResult(data);
    };

    const fetchDataFromNext = async () => {
      const fetchUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!input) return;
      setSearchResult(undefined);
      const res = await axios.post(`${fetchUrl}/api`,{ search: input})
    ;
    const data = res.data; 
      setSearchResult(data as unknown as {results: string[],duration: number});
    };

    if (selectedBox === 1) {
      fetchDataFromHono();
    } else {
      fetchDataFromNext();
    }
  }, [input]);
  const handleBoxClick = (id: number) => {
    setSelectedBox(id);
  };
  return (
    <main className="h-screen w-screen ">
      <div className="w-full flex justify-end items-center pt-16 pr-16" > <ModeToggle  /> </div>
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-5xl tracking-tight font-bold">LIGHTNING-API </h1>{" "}
          <img src="lightening.svg" className="h-20 w-12" />
        </div>
        <p className="text-zinc-600 text-lg max-w-prose text-center">
          A high performance API built with Redis,Hono, Next.js, and Cloudflare
          .<br /> Type a query below and get results in milliseconds.
        </p>

        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-zinc-500"
            />
            <CommandList>
              {searchResult?.results.length === 0 ? (
                <CommandEmpty>No results found</CommandEmpty>
              ) : null}

              {searchResult?.results ? (
                <CommandGroup heading="Results">
                  {searchResult?.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {searchResult?.results ? (
                <>
                  <div className="h-px w-full bg-zinc-200" />
                  <p className=" p-2 text-xs text-zinc-500">
                    Found {searchResult.results.length} results in{" "}
                    {searchResult?.duration.toFixed(0)}ms
                  </p>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>

        <div className=" container flex sm:flex-row flex-col  justify-between  sm:mt-30 pt-20 gap-10 w-auto ">
          <Box id={1} selected={selectedBox === 1} onClick={handleBoxClick} href="/images/logo-small.png" title="Honobackend with redis and cloudflare-workers " />
          <Box id={2} selected={selectedBox === 2} onClick={handleBoxClick} 
          title="Nextjs Backend with Redis "  href="/images/next.png"  />
        </div>
      </div>
    </main>
  );
}
