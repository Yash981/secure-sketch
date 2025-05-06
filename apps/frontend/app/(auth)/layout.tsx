export default function Layout({ children }: Readonly<{ children: React.ReactNode}>){
    return (
        <div className="" style={{
            backgroundImage: "linear-gradient(to right, #868f96 0%, #596164 100%)"
          }}>
            {children}
        </div>
    )
}