import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`border rounded-md shadow-md p-4 bg-white ${className || ""}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`border-b pb-2 mb-2 ${className || ""}`}>{children}</div>;
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`flex-1 ${className || ""}`}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ children, className }) => {
  return <h2 className={`text-lg font-bold ${className || ""}`}>{children}</h2>;
};

export const CardDescription: React.FC<CardProps> = ({ children, className }) => {
  return <p className={`text-sm text-gray-600 ${className || ""}`}>{children}</p>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`mt-4 ${className || ""}`}>{children}</div>;
};