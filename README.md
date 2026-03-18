# CSSLP Flashcard PWA

A high-performance, mobile-first **Progressive Web App (PWA)** designed to help professionals master the **Certified Secure Software Lifecycle Professional (CSSLP)** curriculum. 

This app uses a **Weighted Shuffle Algorithm** to prioritize difficult concepts, ensuring you spend more time on what you don't know and less time on what you've already mastered.

## 🚀 Features

* **Offline Ready**: Built as a PWA; "Add to Home Screen" on iPhone or Android for a full-screen, app-like experience that works without an internet connection.
* **Weighted Learning (SRS)**:
    * **Swipe Left (Red)**: Mark a card as "Difficult."
    * **Swipe Right (Green)**: Mark a card as "Easy."
    * **Shuffle Mode**: The app calculates a weight for each card based on your success history, showing "Red-heavy" cards more frequently.
* **Progress Tracking**: A real-time mastery bar at the bottom tracks your progress across the entire deck.
* **Smart Navigation**: Uses a history stack so the `Prev` button always works correctly, even in Shuffle mode.
* **Data Portability**: 
    * **Local Persistence**: Progress is saved automatically to your device's LocalStorage.
    * **Export/Import**: Backup your study stats or move them between devices via JSON files.
* **Dark Mode**: Optimized for OLED screens to save battery during long study sessions.

## 🛠️ Installation & Setup

1.  **Clone the Repo**:
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```
2.  **Add Your Data**: Ensure your `flashcards.json` follows this format:
    ```json
    [
      {
        "question": "Example Question",
        "answer": "Example Answer"
      }
    ]
    ```
3.  **Add an Icon**: Place a `512x512` PNG file named `icon.png` in the root directory for the PWA icon to appear on mobile devices.
4.  **Host It**: This app is designed to be hosted on **GitHub Pages**, Netlify, or Vercel.

## 📱 Mobile Use (iPhone/Android)

To get the best experience, install the app on your phone:

1.  Open the site in **Safari** (iOS) or **Chrome** (Android).
2.  Tap the **Share** button (iOS) or **Menu** icon (Android).
3.  Select **"Add to Home Screen."**
4.  The app will now appear on your home screen and run in "Standalone Mode" (no browser address bars).

## 🧠 Technical Details

* **Logic**: Vanilla JavaScript (ES6+).
* **Persistence**: `window.localStorage`.
* **UI**: CSS `preserve-3d` for hardware-accelerated card flipping.
* **Algorithm**: The weighted shuffle uses a frequency-pool approach:
    * *Weight Formula*: `Math.ceil(((Red + 1) / (Green + 1)) * 5)`
    * This ensures that difficult cards appear significantly more often than mastered ones.

---
*Created to make CSSLP certification prep efficient and mobile-friendly.*
