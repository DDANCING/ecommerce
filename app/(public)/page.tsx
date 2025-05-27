
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";



export default async function Home() {
  const user = await auth();

  return (
    <div className="flex  m-20">
      <Button className="font-black">  
        HELLO
      </Button>
    </div>
  );
}
