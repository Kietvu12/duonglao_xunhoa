import { useEffect, useRef } from "react";
import * as THREE from "three";
import panoramaImage from "../assets/panorama11.jpg";

const VRView = ({ onClose }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Ensure canvas can receive events
    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none"; // Prevent default touch behavior
    canvas.style.userSelect = "none"; // Prevent text selection
    canvas.style.pointerEvents = "auto"; // Ensure events work

    mountRef.current.appendChild(canvas);

    // Create sphere geometry for panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere

    // Load panorama texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      panoramaImage,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      },
      undefined,
      (error) => {
        console.error("Error loading panorama:", error);
      }
    );

    // Manual controls for 360 rotation - using logic from PanoramaViewer
    const isDragging = { current: false };
    const lastMousePosition = { current: { x: 0, y: 0 } };
    const rotation = { current: { phi: 0, theta: 0 } };

    const updateCameraRotation = () => {
      // Calculate direction from rotation (phi, theta)
      const x =
        Math.cos(rotation.current.phi) * Math.sin(rotation.current.theta);
      const y = Math.sin(rotation.current.phi);
      const z =
        Math.cos(rotation.current.phi) * Math.cos(rotation.current.theta);

      // Camera is at origin, look at the calculated direction
      camera.lookAt(x, y, z);
    };

    const handleMouseDown = (e) => {
      isDragging.current = true;
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastMousePosition.current.x;
      const deltaY = e.clientY - lastMousePosition.current.y;

      // Update rotation - same logic as PanoramaViewer
      rotation.current.theta -= deltaX * 0.005; // Horizontal rotation
      rotation.current.phi -= deltaY * 0.005; // Vertical rotation

      // Limit vertical rotation to prevent flipping
      rotation.current.phi = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotation.current.phi)
      );

      updateCameraRotation();

      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      renderer.domElement.style.cursor = "grab";
    };

    // Touch controls
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        lastMousePosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      e.preventDefault();

      const deltaX = e.touches[0].clientX - lastMousePosition.current.x;
      const deltaY = e.touches[0].clientY - lastMousePosition.current.y;

      rotation.current.theta -= deltaX * 0.005;
      rotation.current.phi -= deltaY * 0.005;
      rotation.current.phi = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotation.current.phi)
      );

      updateCameraRotation();

      lastMousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    // Add event listeners
    canvas.style.cursor = "grab";

    // Mouse events
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseUp); // Handle mouse leaving window

    // Touch events - with passive: false to allow preventDefault
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    // Debug: log when events fire
    console.log("VRView: Event listeners attached to canvas", canvas);

    // Initialize camera rotation
    updateCameraRotation();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
      canvas.style.cursor = "default";

      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      style={{ touchAction: "none" }}
    >
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          touchAction: "none",
          pointerEvents: "auto",
        }}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Đóng VR view"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-sm">
        Kéo chuột hoặc vuốt màn hình để xem 360°
      </div>
    </div>
  );
};

export default VRView;
