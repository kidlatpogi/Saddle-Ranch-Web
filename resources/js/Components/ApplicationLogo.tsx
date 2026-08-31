import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo({ className = '', alt = 'Saddle Ranch Roadhouse Logo', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/saddle_ranch_logo.png"
            alt={alt}
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
