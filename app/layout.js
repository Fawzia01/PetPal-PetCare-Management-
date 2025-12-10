import './globals.css';

export const metadata = {
  title: 'PetPal - Your Pet Care Companion',
  description: 'Track health, nutrition, activities & reminders for your beloved pets',
  keywords: 'pet care, pet health, pet tracking, veterinary, pet nutrition',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
