import { useEffect } from 'react';

function RandomRedirect() {
  useEffect(() => {
    const urlsString = import.meta.env.VITE_REDIRECT_URLS_TO_TEST_WAYF || "";

    const urls = urlsString.split(',')
      .map((url: string) => url.trim())
      .filter((url: string | any[]) => url.length > 0);

    if (urls.length > 0) {
      const randomIndex = Math.floor(Math.random() * urls.length);
      const selectedUrl = urls[randomIndex];

      if (selectedUrl.startsWith('http://') || selectedUrl.startsWith('https://')) {
        window.location.replace(selectedUrl);
      }
    }
  }, []);

  return <h3>Redirecionando...</h3>;
}

export default RandomRedirect;