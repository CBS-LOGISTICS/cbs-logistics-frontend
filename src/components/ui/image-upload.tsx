import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';


interface ImageUploadProps {
    previewUrl?: string | null;
    fileType?: string | null;
    onChange: (file: File | null) => void;
    onRemove: () => void;
    label?: string;
    className?: string;
    value?: string | null;
}

export function ImageUpload({
    onChange,
    onRemove,
    label = "Upload Image",
    className = "",
    previewUrl,
    value,
    fileType,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const displayUrl = previewUrl || value;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onRemove();
    };


    const isPdfFile = fileType === 'application/pdf';

    console.log(isPdfFile, "IS PDF FILE");
    console.log(displayUrl, "DISPLAY URL");


    const triggerUpload = (e: React.MouseEvent) => {
        e.preventDefault();
        inputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
            />

            {displayUrl ? (
                <Card className="relative overflow-hidden w-full h-48 sm:h-64 border-2 border-dashed border-gray-200">
                    <Button
                        onClick={handleRemove}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10 rounded-full w-8 h-8 shadow-md"
                    >
                        <X className="h-4 w-4" />
                    </Button>

                    <div className="relative w-full h-full bg-gray-50 flex items-center justify-center">
                        {isPdfFile ? (
                            <div className="flex flex-col items-center space-y-2">
                                <FileText className="w-12 h-12 text-gray-400" />
                                <p className="text-sm text-gray-600">PDF document</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <a href={displayUrl} target="_blank" rel="noopener noreferrer">
                                        Open PDF
                                    </a>
                                </Button>
                            </div>
                        ) : (
                            <Image
                                src={displayUrl}
                                alt="Uploaded image"
                                fill
                                className="object-contain p-2"
                            />
                        )}
                    </div>
                </Card>
            ) : (
                <Card
                    className="w-full h-48 sm:h-64 border-2 border-dashed border-gray-200 hover:border-[#F63915]/50 transition-colors cursor-pointer group bg-gray-50/50 hover:bg-gray-50"
                    onClick={triggerUpload}
                >
                    <CardContent className="flex flex-col items-center justify-center h-full space-y-4 pt-6">
                        <div className="w-16 h-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-[#F63915]" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-gray-700">{label}</p>
                            <p className="text-xs text-gray-400">Click to upload (JPG, PNG/PDF)</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
