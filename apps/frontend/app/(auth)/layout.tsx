export default function Layout({ children }: Readonly<{ children: React.ReactNode}>){
    return (
        <div className="bg-black">
            {children}
        </div>
    )
}