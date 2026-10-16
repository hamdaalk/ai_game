# Deploy the fixed game on Render

Upload all four application files from this folder: `survey-says.html`, `server.js`,
`package.json`, and `Dockerfile`. The new package removes PeerJS/WebRTC and uses a
WebSocket relay hosted by the same Render service.

Use a **Web Service**, not a Static Site. After deployment:

1. Open `https://YOUR-SERVICE.onrender.com/connection-test`. It should show
   `{"ok":true,"transport":"websocket","rooms":0}`.
2. Open the main URL on the projector and choose **This is the big screen**.
3. On the phone, open the exact same main URL and enter the four-letter room code.
4. Keep the big-screen page open while connecting the phone.

If the old `ai-game-y3mq.onrender.com` address still does not open, use the current
URL displayed for the Web Service in the Render dashboard.
