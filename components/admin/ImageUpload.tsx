'use client';

/**
 * Image upload component with drag and drop
 * Handles file upload to Supabase Storage
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadProductImage } from '@/lib/supabase/storage';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export interface ImageUploadProps {
  onUpload: (url: string) => void;
  existingImageUrl?: string | null;
  onRemove?: () => void;
  disabled?: boolean;
}

export default function ImageUpload({
  onUpload,
  existingImageUrl,
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        const errorMsg = 'Invalid file type. Please upload a JPG, PNG, or WebP image.';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        const errorMsg = 'File size exceeds 5MB limit. Please upload a smaller image.';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        // Simulate progress (Supabase doesn't provide progress callbacks)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Upload to Supabase
        const { url, error: uploadError } = await uploadProductImage(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (uploadError || !url) {
          const errorMsg = uploadError || 'Failed to upload image';
          setError(errorMsg);
          setPreview(null);
          setIsUploading(false);
          toast.error(errorMsg);
          return;
        }

        // Success
        setPreview(url);
        onUpload(url);
        setIsUploading(false);
        setUploadProgress(0);
        toast.success('Image uploaded successfully');
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to upload image';
        setError(errorMsg);
        setPreview(null);
        setIsUploading(false);
        setUploadProgress(0);
        toast.error(errorMsg);
      }
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [disabled, isUploading, handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreview(null);
      setError(null);
      if (onRemove) {
        onRemove();
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onRemove]
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Image
      </label>

      {/* Upload Area */}
      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary hover:bg-gray-50'
            }
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-sm text-gray-600 mb-2">Uploading image...</p>
              {uploadProgress > 0 && (
                <div className="w-full max-w-xs">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
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
                PNG, JPG, WEBP up to 5MB
              </p>
            </>
          )}
        </div>
      ) : (
        /* Preview */
        <div className="relative">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={preview}
              alt="Product preview"
              fill
              className="object-contain"
              unoptimized
            />
            {!disabled && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Remove image"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {!disabled && !isUploading && (
            <Button
              variant="outline"
              size="small"
              onClick={handleClick}
              className="mt-2 w-full"
              type="button"
            >
              Replace Image
            </Button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Help Text */}
      {!error && !preview && (
        <p className="mt-2 text-xs text-gray-500">
          Recommended: Square image, at least 800x800px
        </p>
      )}
    </div>
  );
}




