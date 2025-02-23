# Unify
## Inspiration

![gallery](https://github.com/user-attachments/assets/79e280d4-ab88-4e2d-a203-016a118b5b43)

Music has always been a powerful way to bring people together, and we wanted to create an app that makes it even easier to connect with those nearby through shared tastes. That inspiration led to Unify—an app that lets users find nearby people, see what they’re listening to, and sync up for a shared music experience.

## What it does

![image](https://github.com/user-attachments/assets/5ffc79a2-2f5c-4ad9-bcf2-b048f07050a9)

Unify helps people connect through music by letting users see nearby listeners and tune into their currently playing songs. With Spotify integration, users can:

- Discover Nearby Listeners – View users within a set radius, along with their profile and currently playing song.
- Host a Listening Session – Start broadcasting your music so others can listen along in sync.
- Join a Session – Instantly sync playback with a nearby listener and experience music together.

## How we built it

![gallery-1](https://github.com/user-attachments/assets/2618c890-3f10-4240-af12-a0efa026adf5)

- Frontend: React.js, using Tailwind for styling and navigator.geolocation for user location
- Backend: Express.js, handling authentication and geolocation queries
- Music Sync: Spotify API for fetching user playback data and enabling listening sessions
- Database: MongoDB, storing user data and locations

## Challenges we ran into

- Learning the Spotify API: Spotify’s authentication flow and data retrieval weren’t as straightforward as expected, requiring careful handling of tokens and refresh cycles.
- New Frameworks: Some teammates were new to React or Express, but through teamwork and documentation, we all got up to speed.
- Real-time Syncing (Future Goal!): While we initially used RESTful APIs, we aim to integrate WebSockets for a seamless listening experience.

## Accomplishments and what we learned

![image](https://github.com/user-attachments/assets/608374a5-d3f3-4775-bb06-9e479d0c5aec)


One of the biggest takeaways from this project was the importance of teamwork and organization. To stay on track, we documented every feature and step we needed to implement. This structured approach helped us break the project into manageable parts, ensuring smooth collaboration. We also learned how to navigate real-world development workflows, from setting up authentication to handling user data efficiently.

Despite the challenges we faced, we adapted and pushed through, creating a working prototype that brings people together through music. Unify isn’t just an app—it’s a new way to share and discover music with those around you.

## What's next for Unify

Some key features and improvements we’re planning include:

- WebSockets for Real-time Syncing – Switching from periodic API calls to Socket.io for instant playback updates and smoother synchronization.
- Reactions & Social Features – Adding quick reactions (🔥❤️🎶) and possibly chat features for more interaction.
- Enhanced Discovery – Introducing a Similarity Index to show how closely a user's music taste matches others nearby.
- Better Location Handling – More precise geolocation options and adjustable radius settings.
- Cross-Platform Support – Expanding beyond web to mobile apps for a seamless experience.

Unify is just getting started, and we're excited to keep evolving it into the ultimate social music experience!
