import { useEffect, useState } from "react";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // VERY ważne
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("PWA zainstalowana 🎉");
    } else {
      console.log("Użytkownik anulował instalację");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) return null;

  return (
    <button onClick={handleInstall}>
      📲 Zainstaluj aplikację
    </button>
  );
}

export default InstallButton;
