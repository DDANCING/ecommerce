
import { auth } from "@/auth";



export default async function Home() {
  const user = await auth();

  return (
    <>
      <main className="relative flex h-full flex-col items-center justify-between bg-background">
      AAAAAAA
      </main>
   </>
  );
}
