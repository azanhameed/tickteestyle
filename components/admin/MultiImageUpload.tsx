'use client';

/**
 * Multi Image Upload Component
 * Allows uploading and managing multiple product images
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { uploadProductImage } from '@/lib/supabase/storage';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  existingImages?: string[];
  disabled?: boolean;
  maxImages?: number;
}

export default function MultiImageUpload({
  onImagesChange,
  existingImages = [],
  disabled = false,
  maxImages = 10,
}: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - images.length;

      if (fileArray.length > remainingSlots) {
        toast.error(`You can only add ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}`);
        return;
      }

      // Process each file
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const index = images.length + i;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name}: Invalid file type. Please upload a JPG, PNG, or WebP image.`);
          continue;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error(`${file.name}: File size exceeds 5MB limit.`);
          continue;
        }

        setUploadingIndex(index);
        setUploadProgress((prev) => ({ ...prev, [index]: 0 }));

        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => ({
              ...prev,
              [index]: Math.min(prev[index] || 0 + 10, 90),
            }));
          }, 100);

          // Upload to Supabase
          const { url, error: uploadError } = await uploadProductImage(file);

          clearInterval(progressInterval);
          setUploadProgress((prev) => ({ ...prev, [index]: 100 }));

          if (uploadError || !url) {
            toast.error(`${file.name}: ${uploadError || 'Failed to upload'}`);
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[index];
              return newProgress;
            });
            continue;
          }

          // Add to images array
          const newImages = [...images, url];
          setImages(newImages);
          onImagesChange(newImages);
          toast.success(`${file.name} uploaded successfully`);
        } catch (err: any) {
          toast.error(`${file.name}: ${err.message || 'Failed to upload'}`);
        } finally {
          setUploadingIndex(null);
          setTimeout(() => {
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[index];
              return newProgress;
            });
          }, 500);
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [images, maxImages, onImagesChange]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange(newImages);
      toast.success('Image removed');
    },
    [images, onImagesChange]
  );

  const handleClick = useCallback(() => {
    if (!disabled && uploadingIndex === null) {
      fileInputRef.current?.click();
    }
  }, [disabled, uploadingIndex]);

  const remainingSlots = maxImages - images.length;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 ml-2">
          ({images.length}/{maxImages} images)
        </span>
      </label>

      {/* Existing Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {!disabled && (
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {remainingSlots > 0 && (
        <div
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${disabled || uploadingIndex !== null ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-gray-50'}
            border-gray-300
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            multiple
            className="hidden"
            disabled={disabled || uploadingIndex !== null}
          />

          {uploadingIndex !== null ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-sm text-gray-600 mb-2">Uploading image...</p>
              {uploadProgress[uploadingIndex] > 0 && (
                <div className="w-full max-w-xs">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[uploadingIndex]}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{uploadProgress[uploadingIndex]}%</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP up to 5MB each
              </p>
              <p className="text-xs text-gray-400 mt-2">
                You can add up to {remainingSlots} more image{remainingSlots === 1 ? '' : 's'}
              </p>
            </>
          )}
        </div>
      )}

      {/* Help Text */}
      {images.length === 0 && (
        <p className="mt-2 text-xs text-gray-500">
          At least one image is required. The first image will be used as the primary product image.
        </p>
      )}
    </div>
  );
}

