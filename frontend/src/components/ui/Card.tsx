import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = "",
    title,
    description,
    footer,
}) => {
    return (
        <div className={`overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl ${className}`}>
            {(title || description) && (
                <div className="border-b border-slate-100 px-6 py-4">
                    {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && <div className="bg-slate-50 px-6 py-4">{footer}</div>}
        </div>
    );
};
