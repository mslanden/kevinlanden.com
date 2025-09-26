import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaVideo,
  FaUpload,
  FaTimes,
  FaPlay,
  FaPause,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import api from '../../utils/api';

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragActive ? `${props.theme.colors.primary}11` : 'rgba(20, 20, 20, 0.3)'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.secondary};
    background: rgba(20, 20, 20, 0.5);
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 3rem;
    color: ${props => props.theme.colors.text.muted};
  }

  h4 {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.2rem;
    margin: 0;
  }

  p {
    color: ${props => props.theme.colors.text.muted};
    margin: 0;
    font-size: 0.95rem;
  }
`;

const VideoPreview = styled.div`
  position: relative;
  margin-top: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  max-height: 400px;
  display: block;
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }

  &.danger:hover {
    background: rgba(220, 53, 69, 0.9);
  }

  svg {
    font-size: 1rem;
  }
`;

const VideoInfo = styled.div`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const FileName = styled.div`
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const FileSize = styled.div`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.8rem;
`;

const UploadProgress = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.5);
  border-radius: ${props => props.theme.borderRadius.default};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  transition: width 0.3s ease;
  width: ${props => props.$progress || 0}%;
`;

const ProgressText = styled.div`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.default};
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #dc3545;
  }
`;

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const VideoUpload = ({ video, onVideoChange, accept = { 'video/*': ['.mp4', '.mov', '.avi', '.wmv', '.webm'] } }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Only handle one video
    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('category', 'videos');

      const response = await api.postFormData('/upload/video', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        const videoData = {
          url: response.data.data.publicUrl,
          path: response.data.data.path,
          filename: response.data.data.filename,
          originalName: response.data.data.originalName,
          size: response.data.data.size,
          mimetype: response.data.data.mimetype
        };

        onVideoChange(videoData);
        setUploadProgress(100);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      setError(error.response?.data?.error || 'Failed to upload video');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  }, [onVideoChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: uploading || video
  });

  const handleRemove = async () => {
    if (video?.path) {
      try {
        await api.delete('/upload/image', { path: video.path });
      } catch (error) {
        console.error('Error removing video:', error);
      }
    }
    onVideoChange(null);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      {!video && (
        <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <DropzoneContent>
            <FaVideo />
            <h4>
              {isDragActive
                ? 'Drop video here...'
                : 'Drag & drop drone video here'
              }
            </h4>
            <p>
              or <strong>click to browse</strong>
            </p>
            <p>
              Supports MP4, MOV, AVI, WMV, WebM • Max 200MB
            </p>
          </DropzoneContent>
        </DropzoneContainer>
      )}

      {uploading && (
        <UploadProgress>
          <ProgressText>
            <span>Uploading video...</span>
            <span>{uploadProgress}%</span>
          </ProgressText>
          <ProgressBar>
            <ProgressFill $progress={uploadProgress} />
          </ProgressBar>
        </UploadProgress>
      )}

      <AnimatePresence>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FaExclamationCircle />
            {error}
          </ErrorMessage>
        )}
      </AnimatePresence>

      {video && (
        <VideoPreview>
          <Video
            ref={setVideoRef}
            src={video.url}
            onEnded={() => setIsPlaying(false)}
            loop
            muted
            playsInline
          />
          <VideoControls>
            <ControlButton onClick={togglePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </ControlButton>
            <ControlButton className="danger" onClick={handleRemove} title="Remove video">
              <FaTimes />
            </ControlButton>
          </VideoControls>
          <VideoInfo>
            <FileName>{video.originalName || video.filename}</FileName>
            <FileSize>{video.size ? formatFileSize(video.size) : ''}</FileSize>
          </VideoInfo>
        </VideoPreview>
      )}
    </div>
  );
};

export default VideoUpload;