import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <main className="relative flex flex-col min-h-screen">
            <Navbar />
    <div className="absolute inset-0 z-0 
    bg-[radial-gradient(#dadde2_1px,transparent_1px)] 
    dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]
    bg-[length:18px_18px]" 
/>
    
    <div className="relative flex-1 flex-col px-4 pb-4 z-10">
        {children}
    </div>
</main>
    );
};

export default Layout;
