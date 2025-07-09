import { auth } from "@/auth";
import CartClient from "./_components/cart";

const CartPage = async () => {
  const user = await auth();

  
  if (!user) {
    return null;
  }

  return <CartClient user={{ name: user.user?.name ?? "", email: user.user?.email ?? "" }} />;
};

export default CartPage;