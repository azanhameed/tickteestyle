'use client';

/**
 * Payment proof upload component
 * Handles image/PDF upload for payment proofs
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export interface PaymentProofUploadProps {
  onUpload: (url: string) => void;
  existingUrl?: string | null;
  onRemove?: () => void;
  disabled?: boolean;
  orderId?: string;
}

export default function PaymentProofUpload({
  onUpload,
  existingUrl,
  onRemove,
  disabled = false,
  orderId,
}: PaymentProofUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, or PDF file.');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size exceeds 5MB limit. Please upload a smaller file.');
        return;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview('pdf');
      }

      try {
        // Get current user ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('You must be logged in to upload payment proof');
          setIsUploading(false);
          return;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${orderId || Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `payment-proofs/${user.id}/${fileName}`;

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (uploadError || !data) {
          setError(uploadError?.message || 'Failed to upload file');
          setPreview(null);
          setIsUploading(false);
          return;
        }

        // Get signed URL (since bucket is private)
        const { data: urlData, error: urlError } = await supabase.storage
          .from('payment-proofs')
          .createSignedUrl(filePath, 31536000); // 1 year expiry

        if (urlError || !urlData) {
          setError('Failed to generate file URL');
          setPreview(null);
          setIsUploading(false);
          return;
        }

        // Success
        setPreview(urlData.signedUrl);
        onUpload(urlData.signedUrl);
        setIsUploading(false);
        setUploadProgress(0);
      } catch (err: any) {
        setError(err.message || 'Failed to upload file');
        setPreview(null);
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [onUpload, orderId, supabase]
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
        Payment Proof <span className="text-red-500">*</span>
      </label>

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
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-sm text-gray-600 mb-2">Uploading file...</p>
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
                PNG, JPG, PDF up to 5MB
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {preview === 'pdf' ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <FileText className="w-16 h-16 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">PDF Document</p>
              </div>
            ) : (
              <Image
                src={preview}
                alt="Payment proof preview"
                fill
                className="object-contain"
                unoptimized
              />
            )}
            {!disabled && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Remove file"
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
              Replace File
            </Button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {!error && !preview && (
        <p className="mt-2 text-xs text-gray-500">
          Upload a screenshot or photo of your payment confirmation
        </p>
      )}
    </div>
  );
}




