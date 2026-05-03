import { Footer } from '@/components/navigation/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] bg-[radial-gradient(circle_at_2px_2px,#e2e8f0_1px,transparent_0)] bg-size-[32px_32px]">
      <main className="grow flex items-center justify-center px-6 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
