import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "../components/StoreProvider";

export const metadata: Metadata = {
  title: "TimeToSplit - Synchronize Your Journeys",
  description: "Experience visually stunning trip planning. Track itineraries, vote on plans, and settle debts instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
