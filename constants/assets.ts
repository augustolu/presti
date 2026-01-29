import { prefix } from "@/utils/prefix";

export const videoEditingVideos = [
    { thumbnail: `${prefix}/assets/demo-video-miniatura1.mp4`, full: `${prefix}/assets/demo-video-edit.mp4` },
    { thumbnail: `${prefix}/assets/demo-video-miniatura1.mp4`, full: `${prefix}/assets/demo-video-edit.mp4` },
    { thumbnail: `${prefix}/assets/demo-video-miniatura1.mp4`, full: `${prefix}/assets/demo-video-edit.mp4` },
    { thumbnail: `${prefix}/assets/demo-video-miniatura1.mp4`, full: `${prefix}/assets/demo-video-edit.mp4` },
];

export const motionGraphicsVideos = [
    { thumbnail: `${prefix}/assets/demo-motion-miniatura1.mp4`, full: `${prefix}/assets/demo-motion.mp4` },
    { thumbnail: `${prefix}/assets/demo-motion-miniatura1.mp4`, full: `${prefix}/assets/demo-motion.mp4` },
    { thumbnail: `${prefix}/assets/demo-motion-miniatura1.mp4`, full: `${prefix}/assets/demo-motion.mp4` },
    { thumbnail: `${prefix}/assets/demo-motion-miniatura1.mp4`, full: `${prefix}/assets/demo-motion.mp4` },
];

export const allVideos = [
    ...videoEditingVideos.map(v => v.thumbnail),
    ...motionGraphicsVideos.map(v => v.thumbnail)
];
