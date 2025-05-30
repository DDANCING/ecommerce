

const AuthLayout = ({ children }: { children: React.ReactNode}) => {
  
  return(
    <div className="mt-[6vh] flex items-center justify-center ">
      {children}
    </div>
  );
}

export default AuthLayout