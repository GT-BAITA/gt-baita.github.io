import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function RandomRedirect() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlsParam = searchParams.get('urls');

    if (!urlsParam) return;

    const urls = urlsParam.split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length > 0) {
      const randomIndex = Math.floor(Math.random() * urls.length);
      const selectedUrl = urls[randomIndex];

      if (selectedUrl.startsWith('http://') || selectedUrl.startsWith('https://')) {
        window.location.replace(selectedUrl);
      }
    }
  }, [searchParams]);

  const urlsParam = searchParams.get('urls');
  if (!urlsParam) return <h2>Erro: parâmetro 'urls' não fornecido.</h2>;

  return <h3>Redirecionando...</h3>;
}

export default RandomRedirect;