import "../styles/globals.css";

export const metadata = { title: "Relay", description: "Real-time messaging" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
