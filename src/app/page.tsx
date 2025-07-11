"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Home = () => {
  const[value,setValue]= useState("");

  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background Job Started!")
    }
  }));

  return (
    <div className="p-4 max-w7xl mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)}/>
      <Button disabled= {invoke.isPending} onClick={() => invoke.mutate({value : value})}>
      Invoke Background Jobs
      </Button>  
    </div>
  );
}; 
 
export default Home;
