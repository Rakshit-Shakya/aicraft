"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const Home = () => {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background Job Started!")
    }
  }));

  return (
    <div className="p-4 max-w7xl mx-auto">
      <Button disabled= {invoke.isPending} onClick={() => invoke.mutate({text : "Rakshit"})}>
      Invoke Background Jobs
      </Button>  
    </div>
  );
}; 
 
export default Home;
