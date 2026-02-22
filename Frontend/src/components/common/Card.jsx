const Card = ({
  children,
  className = "",
  hover = false,
  padding = true,
  onClick,
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-lg 
        ${hover ? "hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" : ""}
        ${padding ? "p-6" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-slate-800 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-slate-500 text-sm mt-1 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`mt-4 pt-4 border-t border-slate-100 ${className}`}>
    {children}
  </div>
);

export default Card;
