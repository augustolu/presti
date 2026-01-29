export const videoEditingVideos = [
    { thumbnail: "/assets/demo-video-miniatura1.mp4", full: "/assets/demo-video-edit.mp4" },
    { thumbnail: "/assets/demo-video-miniatura1.mp4", full: "/assets/demo-video-edit.mp4" },
    { thumbnail: "/assets/demo-video-miniatura1.mp4", full: "/assets/demo-video-edit.mp4" },
    { thumbnail: "/assets/demo-video-miniatura1.mp4", full: "/assets/demo-video-edit.mp4" },
];

export const motionGraphicsVideos = [
    { thumbnail: "/assets/demo-motion-miniatura1.mp4", full: "/assets/demo-motion.mp4" },
    { thumbnail: "/assets/demo-motion-miniatura1.mp4", full: "/assets/demo-motion.mp4" },
    { thumbnail: "/assets/demo-motion-miniatura1.mp4", full: "/assets/demo-motion.mp4" },
    { thumbnail: "/assets/demo-motion-miniatura1.mp4", full: "/assets/demo-motion.mp4" },
];

export const allVideos = [
    ...videoEditingVideos.map(v => v.thumbnail),
    ...motionGraphicsVideos.map(v => v.thumbnail)
];
