export const metadata = {
  title: "Create Next App",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <div id="global-modal"></div>
      </body>
    </html>
  );
}