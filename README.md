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

## 📱 How to Use on Your Phone
This app is designed to be used as a **Home Screen App**. Follow these steps to get a full-screen, offline-ready experience:

### 🍏 For iPhone (Safari)
* **Open** the website in Safari.
* **Tap the Share button** (the square with an arrow pointing up at the bottom of the screen).
* **Scroll down** the list of options and tap **"Add to Home Screen."**
* **Name the app** "CSSLP Flash" and tap **Add**.
* **Important**: Close Safari and open the app from your new Home Screen icon. This removes the browser address bars and enables offline mode.

### 🤖 For Android (Chrome)
* **Open** the website in Chrome.
* **Tap the three dots** (Menu) in the top right corner.
* **Tap "Install app"** or **"Add to home screen."**
* **Follow the prompts** to install. You can now launch it directly from your app drawer.

## 🎮 How to Study (Gestures)
Once the app is open, you can navigate without using buttons:

* **Tap the Card**: Flips the card to reveal the answer.
* **Swipe LEFT**: Marks the card as **Difficult** (Red count +1). In Shuffle mode, this card will appear more often.
* **Swipe RIGHT**: Marks the card as **Easy** (Green count +1). In Shuffle mode, this card will appear less often.
* **Top Buttons**: Use the "Prev" and "Next" buttons to move manually through your study history.

## 💾 Saving Your Progress
* **Automatic Sync**: Your scores are saved locally on your phone as you swipe.
* **Export/Import**: To move progress between devices:
    1.  On your Computer, click **Export** to download a `.json` file.
    2.  Send that file to your phone (via Email, AirDrop, or iCloud).
    3.  Open the app on your phone, tap **Import**, and select that file.

## ❓ Why use "Add to Home Screen"?
Using the app from the Home Screen instead of a browser tab provides several benefits:
* **More Screen Space**: The URL bar and browser buttons disappear.
* **Offline Access**: You can study on a plane or in areas with no signal.
* **Persistence**: iOS is less likely to clear your saved scores if the app is installed on the Home Screen.

## 🧠 Technical Details

* **Logic**: Vanilla JavaScript (ES6+).
* **Persistence**: `window.localStorage`.
* **UI**: CSS `3D Transforms` for hardware-accelerated card flipping.
* **Algorithm**: The weighted shuffle uses a frequency-pool approach:
    * *Weight Formula*: `Math.ceil(((Red + 1) / (Green + 1)) * 5)`
    * This ensures that difficult cards appear significantly more often than mastered ones.

---
*Created to make CSSLP certification prep efficient and mobile-friendly.*
