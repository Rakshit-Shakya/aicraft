import { openai, createAgent } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter";
import {getSandbox} from "./utils";
import { inngest } from "./client";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step}) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("aicraft-nextjs-test-2");
      return sandbox.sandboxId;
    });
    const codeAgent = createAgent({
  name: "code-agent",
  system: "You are an expert next.js developer. You write readabe, maintainable code. You write simple next.js & react snippets.",
  model: openai({model: "gpt-4o"}),
    });
    
    const { output } = await codeAgent.run(
    `Write the following snippet: ${event.data.value}`,  // Not '', it's ``
  );

  const sandboxUrl = await step.run("get-sandbox-url", async () => {
    const sandbox = await getSandbox(sandboxId);
    const host = sandbox.getHost(3000);
    return `https://${host}`;
  })

    return { output, sandboxUrl };
  },
);

