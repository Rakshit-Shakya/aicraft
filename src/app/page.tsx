import { getQueryClient, trpc } from "@/trpc/server";
import {dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

const Home = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({text: "Rakshit PREFETCH"}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback= {<p>Loading...</p>}>
      <Client/>
      </Suspense>
    </HydrationBoundary>
  );
}
 
export default Home;
