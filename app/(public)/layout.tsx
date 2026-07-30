
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      lang="en"
      className= "min-h-screen">

     {children}
    </div>
  );
}
