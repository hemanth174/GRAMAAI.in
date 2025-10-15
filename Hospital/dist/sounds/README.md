# Notification Sound Setup

## Current Implementation

The notification system uses a **Web Audio API fallback** that generates sounds programmatically. This means no audio files are required!

## How It Works

1. **Primary**: Attempts to load `notify.mp3` from this directory
2. **Fallback**: If the file doesn't exist, generates a pleasant two-tone beep using Web Audio API
   - First tone: 800 Hz (0.15s)
   - Second tone: 600 Hz (0.2s)
   - Volume: 30% with smooth envelope

## Adding a Custom Notification Sound (Optional)

If you want to use a custom sound instead of the generated beep:

1. Place your audio file here: `Hospital/public/sounds/notify.mp3`
2. Supported formats: MP3, WAV, OGG
3. Recommended duration: 0.5-1.5 seconds
4. Recommended volume: Already set to 70% in code

## Free Sound Resources

You can download free notification sounds from:
- **Freesound**: https://freesound.org/browse/tags/notification/
- **Zapsplat**: https://www.zapsplat.com/sound-effect-category/notifications/
- **Mixkit**: https://mixkit.co/free-sound-effects/notification/

## Testing

The sound plays when:
- A new appointment is submitted from the Patient Portal
- The Hospital Dashboard receives the real-time update via SSE
- Browser notification permission is granted (optional but recommended)

## Browser Compatibility

✅ Chrome/Edge: Full support
✅ Firefox: Full support  
✅ Safari: Full support
✅ Opera: Full support

**Note**: Some browsers may require user interaction before allowing audio playback. The first notification sound will trigger after any user interaction with the page.
