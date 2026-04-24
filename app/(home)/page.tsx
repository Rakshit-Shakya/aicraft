import { ProjectForm } from '@/modules/home/ui/components/project-form';
import { ProjectsList } from '@/modules/home/ui/components/projects-list';
import Image from 'next/image';

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
          src="/logo.svg"
          alt="AiCraft"
          width={200}
          height={200}
          className="hidden md:block"
          />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center">
            Build something with AiCraft
          </h1>
          <p className="text-lg text-muted-foreground text-center">
            Create a project, add your prompt, and let AiCraft generate the code for you. It's that simple. No more waiting around for developers or struggling with code yourself. Just tell AiCraft what you want, and it will do the rest.
          </p>
          <div>
            <ProjectForm/>
          </div>
      </section>
      <ProjectsList/>
    </div>
  );
};
 
 
export default Page;
