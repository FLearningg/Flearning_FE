import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Alert, Progress, Tag, Button } from 'antd';
import {
  CameraOutlined,
  WarningOutlined,
  LockOutlined,
  FullscreenOutlined,
  EyeOutlined
} from '@ant-design/icons';
import * as faceapi from 'face-api.js';
// Temporarily disable COCO-SSD due to TensorFlow conflict
// TODO: Fix by using separate TensorFlow instance or different object detection library
// import * as cocoSsd from '@tensorflow-models/coco-ssd';
import './ProctorMonitor.css';

/**
 * Proctoring Monitor Component
 * Handles fullscreen lock, tab switch detection, camera monitoring
 * Automatically pauses quiz when violations detected
 */
const ProctorMonitor = ({
  sessionId,
  onViolation,
  onLocked,
  onIdentityVerified,
  isActive = true,
  children
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [suspicionScore, setSuspicionScore] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [currentWarning, setCurrentWarning] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [faceCount, setFaceCount] = useState(0);
  const [cameraRetryCount, setCameraRetryCount] = useState(0);
  const [faceDetectionRetryCount, setFaceDetectionRetryCount] = useState(0);
  const [multipleFaceCount, setMultipleFaceCount] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [identitySnapshot, setIdentitySnapshot] = useState(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [suspiciousObjects, setSuspiciousObjects] = useState([]);
  const [suspiciousObjectCount, setSuspiciousObjectCount] = useState(0);

  const videoRef = useRef(null); // Main camera for monitoring
  const identityVideoRef = useRef(null); // Separate video for identity verification
  const canvasRef = useRef(null);
  const identityCanvasRef = useRef(null); // Separate canvas for identity modal
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const objectDetectionIntervalRef = useRef(null);
  const tabSwitchCountRef = useRef(0);
  const fullscreenViolationCountRef = useRef(0);
  const cameraRetryTimeoutRef = useRef(null);
  const faceDetectionRetryTimeoutRef = useRef(null);
  const noFaceDetectedCountRef = useRef(0); // Track total no-face violations
  const multipleFaceCountRef = useRef(0); // Track total multiple-face violations
  const referenceFaceDescriptorRef = useRef(null); // Store verified face descriptor
  const faceMatchFailCountRef = useRef(0);
  const lastFaceMismatchWarningRef = useRef(0); // Throttle face mismatch warnings
  const cocoSsdModelRef = useRef(null);
  const noFaceStartTimeRef = useRef(null); // Track when no face detection started
  const noFaceWarningShownRef = useRef(false); // Track if warning already shown for current absence

  /**
   * Load face-api.js and COCO-SSD models on mount
   */
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading AI models...');
        const MODEL_URL = '/models'; // Models should be in public/models folder
        
        // Load face-api.js models
        console.log('Loading face-api.js models...');
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL).catch(err => {
          console.error('Failed to load tinyFaceDetector:', err);
          throw err;
        });
        console.log('✓ tinyFaceDetector loaded');
        
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL).catch(err => {
          console.error('Failed to load faceLandmark68Net:', err);
          throw err;
        });
        console.log('✓ faceLandmark68Net loaded');
        
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL).catch(err => {
          console.error('Failed to load faceRecognitionNet:', err);
          throw err;
        });
        console.log('✓ faceRecognitionNet loaded');
        
        // Temporarily disable COCO-SSD due to TensorFlow conflict
        console.log('⚠️ Object detection temporarily disabled (TensorFlow conflict)');
        cocoSsdModelRef.current = null;
        
        setModelLoaded(true);
        console.log('✅ All AI models loaded successfully');
      } catch (error) {
        console.error('Failed to load AI models:', error);
        console.error('Error details:', error.message, error.stack);
      }
    };

    loadModels();
  }, []);

  /**
   * Initialize fullscreen and monitoring
   */
  useEffect(() => {
    console.log('🔍 Init check:', { isActive, modelLoaded, identityVerified });
    
    const init = async () => {
      if (isActive && modelLoaded) {
        console.log('🚀 Initializing proctoring system...');
        
        // Only reset and show modal if NOT already verified
        // This prevents showing modal twice when quiz starts
        if (!identityVerified) {
          console.log('🔄 Resetting identity verification for new quiz...');
          setIdentitySnapshot(null);
          setVerificationAttempts(0);
          referenceFaceDescriptorRef.current = null;
          
          requestFullscreen();
          setupEventListeners();
          
          try {
            // Start identity camera for verification modal
            console.log('📷 Starting identity verification camera...');
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
              },
              audio: false
            });

            console.log('✅ Identity camera access granted');
            streamRef.current = stream;
            
            // Show modal first so video element renders
            console.log('📋 Showing identity modal first...');
            setShowIdentityModal(true);
          
            // Wait for modal to render, then attach stream
            setTimeout(() => {
              if (identityVideoRef.current) {
                console.log('✅ identityVideoRef found, attaching stream');
                identityVideoRef.current.srcObject = stream;
                
                identityVideoRef.current.onloadedmetadata = () => {
                  console.log('Identity video metadata loaded');
                  identityVideoRef.current.play()
                    .then(() => {
                      console.log('✅ Identity video is playing');
                      setCameraActive(true);
                    })
                    .catch(err => {
                      console.error('Failed to play identity video:', err);
                    });
                };
              } else {
                console.error('❌ identityVideoRef.current is still null after timeout');
              }
            }, 1000); // Increased timeout to ensure modal renders
          } catch (err) {
            console.error('Failed to start identity camera:', err);
          }
        } else {
          // Already verified - just enable monitoring without showing modal
          console.log('✅ Already verified - enabling monitoring only');
          requestFullscreen();
          setupEventListeners();
        }
      } else if (!isActive) {
        // When inactive (quiz finished), close modal
        console.log('🔴 ProctorMonitor deactivated - closing modal');
        setShowIdentityModal(false);
      }
    };
    
    init();

    return () => {
      cleanupEventListeners();
      stopCamera();
      exitFullscreen();
    };
  }, [isActive, modelLoaded]);
  
  /**
   * Close modal when not active
   */
  useEffect(() => {
    if (!isActive && showIdentityModal) {
      console.log('🔴 Closing identity modal because isActive=false');
      setShowIdentityModal(false);
    }
  }, [isActive, showIdentityModal]);
  
  /**
   * Debug: Log camera state changes
   */
  useEffect(() => {
    console.log('Camera state:', {
      cameraActive,
      hasStream: !!streamRef.current,
      hasVideo: !!videoRef.current,
      videoSrcObject: videoRef.current?.srcObject
    });
  }, [cameraActive]);
  
  /**
   * Debug: Log modal state changes
   */
  useEffect(() => {
    console.log('🎭 Modal state changed:', {
      showIdentityModal,
      identityVerified,
      identitySnapshot: !!identitySnapshot,
      modelLoaded,
      isActive
    });
  }, [showIdentityModal, identityVerified, identitySnapshot, modelLoaded, isActive]);

  /**
   * Request fullscreen mode
   */
  const requestFullscreen = () => {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.error('Failed to enter fullscreen:', err);
        logViolation('exitFullscreen', { reason: 'Failed to enter fullscreen' });
      });
    }
  };

  /**
   * Exit fullscreen
   */
  const exitFullscreen = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  /**
   * Setup event listeners for cheating detection
   */
  const setupEventListeners = () => {
    // Fullscreen change
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    // Visibility change (tab switch)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Window blur (window switch)
    window.addEventListener('blur', handleWindowBlur);

    // Prevent right click
    document.addEventListener('contextmenu', handleContextMenu);

    // Prevent keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);

    // Prevent copy/paste
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
  };

  /**
   * Cleanup event listeners
   */
  const cleanupEventListeners = () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleWindowBlur);
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('copy', handleCopyPaste);
    document.removeEventListener('paste', handleCopyPaste);
  };

  /**
   * Handle fullscreen change
   */
  const handleFullscreenChange = () => {
    const isInFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    );

    setIsFullscreen(isInFullscreen);

    if (!isInFullscreen && isActive) {
      fullscreenViolationCountRef.current++;
      const count = fullscreenViolationCountRef.current;
      
      logViolation('exitFullscreen', {
        count: count,
        timestamp: new Date().toISOString()
      });

      if (count < 3) {
        showWarning({
          title: `⚠️ Thoát fullscreen! (${count}/3)`,
          message: `Bạn đã thoát chế độ toàn màn hình. Còn ${3 - count} lần cảnh báo.`,
          severity: 'critical',
          action: () => requestFullscreen()
        });
      } else {
        // Lock after 3 times
        showWarning({
          title: '🚫 Quiz bị khóa',
          message: 'Thoát fullscreen quá 3 lần. Quiz sẽ bị khóa.',
          severity: 'critical'
        });
        
        setIsLocked(true);
        setLockReason('Thoát chế độ toàn màn hình quá 3 lần. Quiz đã bị khóa.');
        if (onLocked) {
          onLocked('Thoát fullscreen quá 3 lần');
        }
      }
    }
  };

  /**
   * Handle tab/window visibility change
   */
  const handleVisibilityChange = () => {
    if (document.hidden && isActive) {
      tabSwitchCountRef.current++;
      const count = tabSwitchCountRef.current;
      
      logViolation('tabSwitch', {
        count: count,
        timestamp: new Date().toISOString()
      });

      if (count < 3) {
        showWarning({
          title: `⚠️ Cảnh báo đổi tab! (${count}/3)`,
          message: `Bạn đã rời khỏi trang thi. Còn ${3 - count} lần cảnh báo.`,
          severity: 'critical'
        });
      } else {
        // Lock after 3 times
        showWarning({
          title: '🚫 Quiz bị khóa',
          message: 'Đổi tab quá 3 lần. Quiz sẽ bị khóa.',
          severity: 'critical'
        });
        
        setIsLocked(true);
        setLockReason('Đổi tab quá 3 lần. Quiz đã bị khóa.');
        if (onLocked) {
          onLocked('Đổi tab quá 3 lần');
        }
      }
    }
  };

  /**
   * Handle window blur (Alt+Tab)
   */
  const handleWindowBlur = () => {
    if (isActive && document.fullscreenElement) {
      logViolation('windowSwitch', {
        timestamp: new Date().toISOString()
      });

      showWarning({
        title: 'Cảnh báo: Đổi cửa sổ!',
        message: 'Không được chuyển sang ứng dụng khác!',
        severity: 'critical'
      });
    }
  };

  /**
   * Prevent right click
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  /**
   * Prevent dangerous keyboard shortcuts
   */
  const handleKeyDown = (e) => {
    // Prevent F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      showWarning({
        title: '⚠️ Không được mở DevTools!',
        message: 'F12 bị vô hiệu hóa trong khi làm bài.',
        severity: 'high'
      });
      return false;
    }

    // Prevent Ctrl+Shift+I/J/C (DevTools)
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault();
      showWarning({
        title: '⚠️ Không được mở DevTools!',
        message: 'Phím tắt DevTools bị vô hiệu hóa trong khi làm bài.',
        severity: 'high'
      });
      return false;
    }

    // Prevent Ctrl+U (View Source)
    if (e.ctrlKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      return false;
    }

    // Prevent Alt+Tab (visual warning only)
    if (e.altKey && e.key === 'Tab') {
      showWarning({
        title: 'Cảnh báo!',
        message: 'Không được sử dụng Alt+Tab!',
        severity: 'high'
      });
    }
  };

  /**
   * Prevent copy/paste
   */
  const handleCopyPaste = (e) => {
    e.preventDefault();
    showWarning({
      title: 'Không được phép!',
      message: 'Copy/Paste bị vô hiệu hóa trong khi thi.',
      severity: 'medium'
    });
    return false;
  };

  /**
   * Start main camera for continuous monitoring (uses videoRef)
   */
  const startCamera = async () => {
    try {
      console.log('📷 Starting monitoring camera...');
      
      // Reuse the same stream if available
      const stream = streamRef.current || await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      console.log('✅ Monitoring camera access granted, stream:', !!stream);
      streamRef.current = stream;
      
      // Return promise that resolves when video is playing
      return new Promise((resolve, reject) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Monitoring video metadata loaded');
            videoRef.current.play()
              .then(() => {
                console.log('✅ Monitoring video is playing');
                setCameraActive(true);
                setCameraRetryCount(0);
                resolve();
              })
              .catch(err => {
                console.error('Failed to play monitoring video:', err);
                reject(err);
              });
          };
        } else {
          console.error('❌ videoRef.current is null');
          reject(new Error('videoRef not found'));
        }
      });

      // Don't start face detection yet - wait for identity verification
      // startFaceDetection() will be called after identity verification
    } catch (error) {
      console.error('Failed to start camera:', error);
      
      // Retry logic
      if (cameraRetryCount < 3) {
        const newRetryCount = cameraRetryCount + 1;
        setCameraRetryCount(newRetryCount);
        
        showWarning({
          title: `Camera bị từ chối! (Lần ${newRetryCount}/3)`,
          message: `Bạn phải bật camera để làm bài thi. Còn ${3 - newRetryCount} lần thử.`,
          severity: 'critical'
        });
        
        logViolation('cameraAccessDenied', { 
          reason: 'Camera access denied',
          retryCount: newRetryCount
        });
        
        // Retry after 5 seconds
        cameraRetryTimeoutRef.current = setTimeout(() => {
          startCamera();
        }, 5000);
      } else {
        // Lock quiz after 3 failed attempts
        logViolation('cameraAccessDenied', { 
          reason: 'Camera access denied after 3 attempts',
          retryCount: cameraRetryCount,
          final: true
        });
        
        setIsLocked(true);
        setLockReason('Không thể bật camera sau 3 lần thử. Quiz đã bị khóa.');
        if (onLocked) {
          onLocked('Không thể bật camera sau 3 lần thử');
        }
      }
    }
  };

  /**
   * Stop camera
   */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    if (objectDetectionIntervalRef.current) {
      clearInterval(objectDetectionIntervalRef.current);
    }
    if (cameraRetryTimeoutRef.current) {
      clearTimeout(cameraRetryTimeoutRef.current);
    }
    if (faceDetectionRetryTimeoutRef.current) {
      clearTimeout(faceDetectionRetryTimeoutRef.current);
    }
    setCameraActive(false);
  };

  /**
   * Draw bounding boxes on canvas with face matching info and suspicious objects
   */
  const drawBoundingBoxes = (detections, matches) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw faces
    detections.forEach((detection, index) => {
      const box = detection.detection.box;
      const isMatch = matches[index];
      
      // Color: green if matched, red if not matched or multiple faces
      const color = isMatch && detections.length === 1 ? '#00ff00' : '#ff0000';
      
      // Draw rectangle
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw label
      ctx.fillStyle = color;
      ctx.font = '20px Arial';
      let label = '';
      if (detections.length > 1) {
        label = `Person ${index + 1} - Unknown`;
      } else if (isMatch) {
        label = '✓ Verified Student';
      } else {
        label = '⚠️ Different Person!';
      }
      ctx.fillText(label, box.x, box.y > 25 ? box.y - 10 : box.y + box.height + 25);
    });

    // Draw suspicious objects
    if (suspiciousObjects.length > 0) {
      suspiciousObjects.forEach(obj => {
        const [x, y, width, height] = obj.bbox;
        
        // Draw orange/yellow rectangle for objects
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Draw label
        ctx.fillStyle = '#ff9800';
        ctx.font = 'bold 20px Arial';
        const label = `⚠️ ${obj.class.toUpperCase()} (${Math.round(obj.score * 100)}%)`;
        
        // Background for text
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(255, 152, 0, 0.8)';
        ctx.fillRect(x, y - 30, textWidth + 10, 30);
        
        ctx.fillStyle = '#fff';
        ctx.fillText(label, x + 5, y - 8);
      });
    }
  };

  /**
   * Capture identity verification photo and extract face descriptor
   */
  const captureIdentityPhoto = async () => {
    if (!identityVideoRef.current || !modelLoaded) {
      showWarning({
        title: 'Lỗi Camera',
        message: 'Camera hoặc AI model chưa sẵn sàng. Vui lòng thử lại.',
        severity: 'high'
      });
      return false;
    }

    try {
      // Detect face with landmarks and descriptor from identity video
      const detections = await faceapi
        .detectAllFaces(identityVideoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      if (detections.length === 0) {
        setVerificationAttempts(prev => prev + 1);
        showWarning({
          title: 'Không phát hiện khuôn mặt',
          message: 'Vui lòng nhìn thẳng vào camera, đảm bảo đủ ánh sáng và thử lại.',
          severity: 'high'
        });
        return false;
      }

      if (detections.length > 1) {
        setVerificationAttempts(prev => prev + 1);
        showWarning({
          title: 'Phát hiện nhiều người',
          message: 'Chỉ được có 1 người trong khung hình. Vui lòng thử lại.',
          severity: 'critical'
        });
        return false;
      }

      // Store reference face descriptor for comparison
      const detection = detections[0];
      referenceFaceDescriptorRef.current = detection.descriptor;

      // Capture photo from identity video
      const canvas = document.createElement('canvas');
      canvas.width = identityVideoRef.current.videoWidth;
      canvas.height = identityVideoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(identityVideoRef.current, 0, 0);

      // Draw bounding box on the snapshot
      const box = detection.detection.box;
      
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 4;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      
      ctx.fillStyle = '#00ff00';
      ctx.font = '24px Arial';
      ctx.fillText('✓ Reference Face', box.x, box.y > 30 ? box.y - 10 : box.y + box.height + 30);

      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setIdentitySnapshot(imageData);

      // Log to backend (NOT saving image, just logging event)
      if (onViolation && sessionId) {
        try {
          await onViolation(sessionId, 'identityVerified', {
            timestamp: new Date().toISOString(),
            faceCount: 1,
            verified: true,
            hasReferenceDescriptor: true
          });
        } catch (err) {
          console.error('Failed to log identity verification:', err);
        }
      }

      console.log('✅ Reference face captured and descriptor saved');
      console.log('Reference descriptor length:', referenceFaceDescriptorRef.current.length);
      return true;
    } catch (error) {
      console.error('Failed to capture identity photo:', error);
      setVerificationAttempts(prev => prev + 1);
      return false;
    }
  };

  /**
   * Handle identity verification
   */
  const handleVerifyIdentity = async () => {
    // If already captured, close modal and start main camera + monitoring
    if (identitySnapshot && referenceFaceDescriptorRef.current) {
      console.log('✅ Using already captured identity, closing modal...');
      setIdentityVerified(true);
      setShowIdentityModal(false);

      // Notify parent component that identity is verified
      if (onIdentityVerified) {
        onIdentityVerified(true);
      }

      // Wait for React to re-render with camera preview, then start camera
      setTimeout(async () => {
        try {
          console.log('🎥 Starting main monitoring camera...');
          await startCamera();

          // Wait a bit more then start face detection
          setTimeout(() => {
            console.log('Starting face detection...');
            startFaceDetection();
            console.log('✅ Face detection started');

            // Object detection disabled due to TensorFlow conflict
            // startObjectDetection();
          }, 300);
        } catch (err) {
          console.error('Failed to start monitoring camera:', err);
        }
      }, 500); // Reduced timeout for faster response
      return;
    }

    console.log('🔐 Starting identity verification...');

    try {
      const success = await captureIdentityPhoto();
      console.log('Identity capture result:', success);

      if (success) {
        console.log('✅ Identity verification successful');
        setVerificationAttempts(0);
        // Don't close modal yet, let user click OK button to confirm

      } else {
        console.log('❌ Identity verification failed');
        // Allow 3 attempts
        if (verificationAttempts >= 3) {
          setIsLocked(true);
          setLockReason('Không thể xác thực danh tính sau 3 lần thử. Quiz đã bị khóa.');
          if (onLocked) {
            onLocked('Không thể xác thực danh tính sau 3 lần thử');
          }
          setShowIdentityModal(false);
        }
      }
    } catch (error) {
      console.error('Error in handleVerifyIdentity:', error);
      setVerificationAttempts(prev => prev + 1);
    }
  };

  /**
   * Start object detection to detect phones, books, etc.
   */
  const startObjectDetection = () => {
    // Check if COCO-SSD is available
    if (!cocoSsdModelRef.current) {
      console.warn('COCO-SSD model not loaded, object detection disabled');
      return;
    }

    // Detect objects every 3 seconds
    objectDetectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !cocoSsdModelRef.current || !identityVerified) return;
      if (videoRef.current.readyState !== 4) return;

      try {
        const predictions = await cocoSsdModelRef.current.detect(videoRef.current);
        
        // Suspicious objects to detect
        const suspiciousClasses = [
          'cell phone',
          'book',
          'laptop',
          'keyboard',
          'mouse',
          'remote',
          'scissors',
          'toothbrush' // Sometimes detects pens/pencils as this
        ];

        const detectedSuspicious = predictions.filter(pred => 
          suspiciousClasses.includes(pred.class) && pred.score > 0.5
        );

        setSuspiciousObjects(detectedSuspicious);

        if (detectedSuspicious.length > 0) {
          const newCount = suspiciousObjectCount + 1;
          setSuspiciousObjectCount(newCount);

          const objectNames = detectedSuspicious.map(obj => obj.class).join(', ');
          
          logViolation('suspiciousObject', {
            timestamp: new Date().toISOString(),
            objects: detectedSuspicious.map(obj => ({
              class: obj.class,
              score: obj.score,
              bbox: obj.bbox
            })),
            count: newCount
          });

          showWarning({
            title: `⚠️ Phát hiện vật thể khả nghi! (${newCount}/3)`,
            message: `Phát hiện: ${objectNames}. Không được sử dụng vật dụng trong khi thi.`,
            severity: 'critical'
          });

          // Lock after 3 detections
          if (newCount >= 3) {
            setIsLocked(true);
            setLockReason(`Phát hiện vật thể khả nghi (${objectNames}) sau ${newCount} lần. Quiz đã bị khóa.`);
            if (onLocked) {
              onLocked(`Phát hiện vật thể khả nghi: ${objectNames}`);
            }
          }
        }

      } catch (error) {
        console.error('Object detection error:', error);
      }
    }, 3000);
  };

  /**
   * Start face detection with face matching
   */
  const startFaceDetection = () => {
    // Detection every 2 seconds
    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !modelLoaded || !referenceFaceDescriptorRef.current) return;
      if (videoRef.current.readyState !== 4) return; // Wait for video to be ready

      try {
        // Detect faces with descriptors
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();
        
        const numFaces = detections.length;
        setFaceCount(numFaces);
        setFaceDetected(numFaces > 0);

        // Compare each detected face with reference
        const matches = detections.map(detection => {
          const distance = faceapi.euclideanDistance(
            referenceFaceDescriptorRef.current,
            detection.descriptor
          );
          // Distance < 0.6 is considered a match (you can adjust this threshold)
          return distance < 0.6;
        });

        // Draw bounding boxes with match info
        drawBoundingBoxes(detections, matches);

        // No face detected - Track duration and warn after 3-4 seconds
        if (numFaces === 0) {
          const now = Date.now();

          // Start tracking time if not already tracking
          if (!noFaceStartTimeRef.current) {
            noFaceStartTimeRef.current = now;
            noFaceWarningShownRef.current = false;
          }

          // Calculate how long face has been absent
          const absenceDuration = (now - noFaceStartTimeRef.current) / 1000; // in seconds

          // If absent for 3+ seconds and warning not yet shown, show warning
          if (absenceDuration >= 3 && !noFaceWarningShownRef.current) {
            noFaceDetectedCountRef.current += 1;
            const totalNoFaceCount = noFaceDetectedCountRef.current;
            setFaceDetectionRetryCount(totalNoFaceCount);

            // Log violation
            logViolation('noFaceDetected', {
              timestamp: new Date().toISOString(),
              totalCount: totalNoFaceCount,
              faceCount: 0,
              absenceDuration: absenceDuration.toFixed(1)
            });

            // Show warning
            showWarning({
              title: `⚠️ Không phát hiện khuôn mặt!`,
              message: `Vui lòng quay lại màn hình và nhìn vào camera. Thời gian rời khỏi: ${absenceDuration.toFixed(1)}s`,
              severity: 'warning'
            });

            noFaceWarningShownRef.current = true; // Mark warning as shown
          }
        }
        // Multiple faces detected (CHEATING!)
        else if (numFaces > 1) {
          // Reset no-face timer since faces are detected
          if (noFaceStartTimeRef.current) {
            noFaceStartTimeRef.current = null;
            noFaceWarningShownRef.current = false;
          }

          multipleFaceCountRef.current += 1;
          const totalMultipleFaceCount = multipleFaceCountRef.current;
          setMultipleFaceCount(totalMultipleFaceCount); // Update UI counter
          
          logViolation('multipleFaces', {
            timestamp: new Date().toISOString(),
            faceCount: numFaces,
            totalCount: totalMultipleFaceCount
          });

          if (totalMultipleFaceCount < 3) {
            showWarning({
              title: `⚠️ Phát hiện ${numFaces} người! (${totalMultipleFaceCount}/3)`,
              message: `Chỉ được có 1 người làm bài. Còn ${3 - totalMultipleFaceCount} lần cảnh báo.`,
              severity: 'critical'
            });
          } else if (totalMultipleFaceCount === 3) {
            // Lock after 3 times
            showWarning({
              title: '🚫 Quiz bị khóa',
              message: `Phát hiện nhiều người (${numFaces} người) quá 3 lần. Quiz sẽ bị khóa.`,
              severity: 'critical'
            });
            
            setIsLocked(true);
            setLockReason(`Phát hiện nhiều người sau 3 lần. Quiz đã bị khóa.`);
            if (onLocked) {
              onLocked(`Phát hiện ${numFaces} người trong camera`);
            }
          }
        }
        // Exactly 1 face detected - check if it matches reference
        else if (numFaces === 1) {
          const isMatchedFace = matches[0];
          
          if (!isMatchedFace) {
            // Different person detected!
            faceMatchFailCountRef.current++;

            logViolation('differentPerson', {
              timestamp: new Date().toISOString(),
              failCount: faceMatchFailCountRef.current,
              message: 'Detected face does not match reference face'
            });

            // Throttle warning: only show once every 5 seconds
            const now = Date.now();
            if (now - lastFaceMismatchWarningRef.current > 5000) {
              lastFaceMismatchWarningRef.current = now;

              showWarning({
                title: `⚠️ Phát hiện người khác! (${faceMatchFailCountRef.current}/3)`,
                message: `Khuôn mặt không khớp với người đã xác thực ban đầu. Đây là lần vi phạm thứ ${faceMatchFailCountRef.current}.`,
                severity: 'critical'
              });
            }

            // Lock after 3 mismatches
            if (faceMatchFailCountRef.current >= 3) {
              setIsLocked(true);
              setLockReason('Phát hiện người khác thay thế sau 3 lần cảnh báo. Quiz đã bị khóa.');
              if (onLocked) {
                onLocked('Phát hiện người khác thay thế người thi');
              }
            }
          } else {
            // Face matches - reset counters
            if (faceMatchFailCountRef.current > 0) {
              faceMatchFailCountRef.current = 0;
              lastFaceMismatchWarningRef.current = 0; // Reset throttle
            }

            // Reset no-face timer since correct face is detected
            if (noFaceStartTimeRef.current) {
              noFaceStartTimeRef.current = null;
              noFaceWarningShownRef.current = false;
            }
          }
        }

      } catch (error) {
        console.error('Face detection error:', error);
      }
    }, 500); // Fast detection: 0.5 seconds
  };

  /**
   * Log violation to backend
   */
  const logViolation = async (type, details) => {
    try {
      const violation = {
        type,
        timestamp: new Date(),
        details
      };

      setViolations(prev => [...prev, violation]);

      // Call parent callback
      if (onViolation) {
        const result = await onViolation(sessionId, type, details);
        
        if (result) {
          setSuspicionScore(result.suspicionScore);
          
          // Check if locked
          if (result.isLocked && !isLocked) {
            setIsLocked(true);
            setLockReason(result.lockReason);
            if (onLocked) {
              onLocked(result.lockReason);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to log violation:', error);
    }
  };

  /**
   * Show warning modal
   */
  const showWarning = (warning) => {
    setCurrentWarning(warning);
    setShowWarningModal(true);
  };

  /**
   * Handle warning acknowledged
   */
  const handleWarningOk = () => {
    if (currentWarning?.action) {
      currentWarning.action();
    }
    setShowWarningModal(false);
    setCurrentWarning(null);
  };

  /**
   * Get severity color
   */
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ff4d4f';
      case 'high': return '#ff7a45';
      case 'medium': return '#ffa940';
      case 'low': return '#ffc53d';
      default: return '#d9d9d9';
    }
  };

  // If locked, show lock screen
  if (isLocked) {
    return (
      <div className="proctor-lock-screen">
        <div className="lock-content">
          <LockOutlined className="lock-icon" />
          <h1>Bài thi đã bị khóa</h1>
          <p>{lockReason}</p>
          <Alert
            message="Quiz bị khóa do vi phạm quy định"
            description="Vui lòng liên hệ giảng viên để được hỗ trợ."
            type="error"
            showIcon
          />
          <div className="lock-stats">
            <div>Số vi phạm: <strong>{violations.length}</strong></div>
            <div>Điểm nghi ngờ: <strong>{suspicionScore}</strong></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="proctor-monitor">
      {/* Identity Verification Modal */}
      <Modal
        open={showIdentityModal}
        title={
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            <CameraOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Xác thực danh tính
          </span>
        }
        onOk={handleVerifyIdentity}
        onCancel={() => {}}
        closable={false}
        maskClosable={false}
        keyboard={false}
        okText={identitySnapshot ? "✅ Xác nhận & Bắt đầu" : "📸 Chụp ảnh xác nhận"}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ 
          size: 'large',
          type: 'primary',
          icon: identitySnapshot ? null : <CameraOutlined />
        }}
        width={600}
        centered
      >
        <div className="identity-verification-content">
          <Alert
            message="Bắt buộc xác thực danh tính trước khi bắt đầu"
            description={
              <div>
                <p><strong>Hướng dẫn:</strong></p>
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  <li>Đảm bảo khuôn mặt của bạn rõ ràng trong khung hình</li>
                  <li>Chỉ có duy nhất 1 người trong camera</li>
                  <li>Nhìn thẳng vào camera</li>
                  <li>Đủ ánh sáng để nhận diện khuôn mặt</li>
                </ul>
                {verificationAttempts > 0 && (
                  <p style={{ color: '#ff4d4f', fontWeight: 'bold', marginTop: 12 }}>
                    ⚠️ Lần thử: {verificationAttempts}/3
                  </p>
                )}
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <div className="identity-camera-preview">
            <video 
              ref={identityVideoRef} 
              autoPlay 
              muted 
              playsInline 
              style={{ 
                width: '100%', 
                borderRadius: 8,
                backgroundColor: '#000'
              }} 
            />
            <canvas ref={identityCanvasRef} className="face-detection-canvas" />
            {!cameraActive && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center',
                zIndex: 10
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                <div style={{ fontSize: '16px' }}>Đang khởi động camera...</div>
              </div>
            )}
          </div>

          {identitySnapshot && (
            <div style={{ marginTop: 16 }}>
              <Alert
                message="✓ Ảnh xác thực đã được chụp thành công"
                description="Click OK để tiếp tục"
                type="success"
                showIcon
              />
            </div>
          )}
        </div>
      </Modal>

      {/* Warning Modal */}
      <Modal
        open={showWarningModal}
        title={
          <span>
            <WarningOutlined style={{ color: getSeverityColor(currentWarning?.severity), marginRight: 8 }} />
            {currentWarning?.title}
          </span>
        }
        onOk={handleWarningOk}
        onCancel={() => {}}
        closable={false}
        maskClosable={false}
        keyboard={false}
        okText="Đã hiểu"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <Alert
          message={currentWarning?.message}
          type="error"
          showIcon
        />
      </Modal>

      {/* Monitoring Status Bar */}
      <div className="proctor-status-bar">
        <div className="status-item">
          <FullscreenOutlined />
          <span>Fullscreen: {isFullscreen ? 'ON' : 'OFF'}</span>
        </div>
        <div className="status-item">
          <CameraOutlined />
          <span>Camera: {cameraActive ? 'Active' : 'Inactive'}</span>
        </div>
        <div className="status-item">
          <EyeOutlined />
          <span>
            {faceCount === 0 && 'No Face'}
            {faceCount === 1 && '1 Person ✓'}
            {faceCount > 1 && <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{faceCount} People! ⚠️</span>}
          </span>
        </div>
        <div className="status-item">
          <Tag color={suspicionScore >= 50 ? 'error' : 'warning'}>
            Suspicion: {suspicionScore}
          </Tag>
        </div>
      </div>

      {/* Camera preview - only show after identity verified */}
      {identityVerified && (
        <div className="proctor-camera-preview">
          <div className="camera-header">
            <CameraOutlined style={{ marginRight: 8 }} />
            <span>Camera giám sát</span>
            {!modelLoaded && <Tag color="processing">Loading AI...</Tag>}
            {modelLoaded && !cameraActive && <Tag color="error">Inactive</Tag>}
            {modelLoaded && cameraActive && faceCount === 0 && <Tag color="warning">No Face</Tag>}
            {modelLoaded && cameraActive && faceCount === 1 && <Tag color="success">✓ Verified</Tag>}
            {modelLoaded && cameraActive && faceCount > 1 && <Tag color="error">{faceCount} People!</Tag>}
          </div>
          <div className="camera-view">
            <video ref={videoRef} autoPlay muted playsInline />
            <canvas ref={canvasRef} className="face-detection-canvas" />
            {!modelLoaded && (
              <div className="loading-overlay">
                <div className="loading-spinner">⏳</div>
                <p>Loading AI Model...</p>
              </div>
            )}
          </div>
          {identitySnapshot && (
            <div className="identity-verified-banner">
              <div className="verified-icon">✓</div>
              <span>Danh tính đã xác thực</span>
              <Button 
                size="small" 
                type="link" 
                onClick={() => {
                  const win = window.open();
                  win.document.write(`<img src="${identitySnapshot}" style="max-width:100%"/>`);
                }}
              >
                Xem ảnh
              </Button>
            </div>
          )}
          {cameraRetryCount > 0 && (
            <div className="camera-retry-warning">
              <WarningOutlined />
              <span>Đang thử lại camera... ({cameraRetryCount}/3)</span>
            </div>
          )}
          {multipleFaceCount > 0 && (
            <div className="multiple-face-warning">
              <WarningOutlined />
              <span>⚠️ Phát hiện nhiều người: {multipleFaceCount}/3</span>
            </div>
          )}
          {suspiciousObjectCount > 0 && (
            <div className="suspicious-object-warning">
              <WarningOutlined />
              <span>⚠️ Phát hiện vật thể khả nghi: {suspiciousObjectCount}/3</span>
              {suspiciousObjects.length > 0 && (
                <div style={{ fontSize: '11px', marginTop: 4 }}>
                  {suspiciousObjects.map((obj, i) => (
                    <span key={i} style={{ marginRight: 8 }}>
                      📱 {obj.class} ({Math.round(obj.score * 100)}%)
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quiz content */}
      <div className="proctor-content">
        {children}
      </div>
    </div>
  );
};

export default ProctorMonitor;
