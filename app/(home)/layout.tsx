interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <main className="relative flex flex-col min-h-screen">
    <div className="absolute inset-0 z-0 bg-[radial-gradient(#dadde2_1px,transparent_1px)] bg-[length:16px_16px]" />
    
    <div className="relative flex-1 flex-col px-4 pb-4 z-10">
        {children}
    </div>
</main>
    );
};

export default Layout;
