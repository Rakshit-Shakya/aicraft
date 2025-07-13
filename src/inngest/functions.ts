import { openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter";
import {getSandbox, lastAssistantTextMessageContent} from "./utils";
import { inngest } from "./client";
import {z} from "zod";
import { PROMPT } from "@/prompt";

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
  description: "An Expert coding agent",
  system: PROMPT,
  model: openai({
    model: "gpt-4.1",
    defaultParameters: {
      temperature: 0.1,  // Temperature is randomness, higher number, higher randomness.
    }
  }),
  tools:[
    createTool({
      name: "terminal",
      description: "Use the terminal to run commands",
      parameters: z.object({
        command: z.string(),
      }),
      handler: async ({command}, {step}) => {
        return await step?.run("terminal", async () =>{
          const buffers = {stdout: "", stderr: ""};

          try{
            const sandbox = await getSandbox(sandboxId);
            const result = await sandbox.commands.run(command, {
              onStdout: (data: string) => {
                buffers.stdout += data;
              },
              onStderr: (data: string) => {
                buffers.stderr += data;
              }
            });
            return result.stdout;
          } catch(e){
            console.error(
              `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`,
            );
              return `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
          }
        });
      },
    }),
    createTool({
      name: "CreateOrUpdateFiles",
      description: "Create or Update files in the sandbox",
      parameters: z.object({
        files: z.array(
          z.object({
            path: z.string(),
            content: z.string(),
          }),
        ),
      }),
      handler: async (
        { files },
        {step, network}
      ) => {
        const newFiles =  await step?.run("CreateOrUpdateFiles", async () => {
          try{ 
            const updatedFiles = network.state.data.file || {};
            const sandbox = await getSandbox(sandboxId);
            for(const file of files) {
              await sandbox.files.write(file.path, file.content);
              updatedFiles[file.path] = file.content;
            }
            return updatedFiles;
          } catch(e){
            return "Error: " + e;
          }
        });
        if(typeof newFiles == "object") {
          network.state.data.files = newFiles;
        }
      }
   }),
   createTool({
    name: "readFiles",
    description: "Read fiels from the sandbox",
    parameters: z.object({
      files: z.array(z.string()),
    }),
    handler: async ({files}, {step}) =>{
      return await step?.run("readFiles", async () => {
      try{
        const sandbox = await getSandbox(sandboxId);
        const contents = [];
        for(const file of files){
          const content = await sandbox.files.read(file);
          contents.push({path: file, content});
        }
        return JSON.stringify(contents);
      } catch (e) {
        return "Error: " + e;
      }
    })
    },
   })
  ],
  lifecycle: {
    onResponse: async ({result, network}) => {
      const lastAssistantMessagetext = 
      lastAssistantTextMessageContent(result);

      if (lastAssistantMessagetext && network){
        if(lastAssistantMessagetext.includes("<task_summary")) {
          network.state.data.sumary = lastAssistantMessagetext;
        }
      }
      return result;
    },
  },
 });

 const network = createNetwork({
  name: "coding-agent-network",
  agents: [codeAgent],
  maxIter: 5,
  router: async ({network}) => {
    const summary = network.state.data.summary;

    if (summary){
      return;
    }
    return codeAgent;
  },
 });
    
   const result = await network.run(event.data.value);

  const sandboxUrl = await step.run("get-sandbox-url", async () => {
    const sandbox = await getSandbox(sandboxId);
    const host = sandbox.getHost(3000);
    return `https://${host}`;
  })

    return { 
    url: sandboxUrl,
    title: "Fragment",
    files: result.state.data.files,
    summary: result.state.data.summary,   
  };
  },
);

