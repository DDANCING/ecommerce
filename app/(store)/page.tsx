import { registerVisitor } from "@/actions/register-visitor";


export default async function Home() {
  await registerVisitor();
  
  return (
    <div className="flex  m-20">
      
    </div>
  );
}
