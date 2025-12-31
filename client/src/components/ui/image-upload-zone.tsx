import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface ImageUploadZoneProps {
    onImageSelected: (file: File) => void;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({ onImageSelected }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelected(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelected(file);
        }
    };

    return (
        <div
            className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                flex flex-col items-center justify-center gap-3
                ${isDragging
                    ? 'border-primary bg-primary/10 scale-[0.99]'
                    : 'border-border/50 bg-muted/20 hover:bg-muted/30 hover:border-primary/30'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            <div className={`p-4 rounded-full bg-background shadow-sm ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}>
                <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                    {isDragging ? 'Drop it here!' : 'Click or Drag image here'}
                </p>
                <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG (Max 50MB). Images are auto-compressed.
                </p>
            </div>
        </div>
    );
};
