import { useEffect } from 'react';

function RandomRedirect() {
  useEffect(() => {
    // https://t.maze.co/501900855 -> WAYF ATUAL
    // https://t.maze.co/501964025 -> BUSCA INLINE
    // https://t.maze.co/502054013 -> DRILL DOWN

    const urlWeights = [
      { url: "https://t.maze.co/501900855", weight: 1 },
      { url: "https://t.maze.co/501964025", weight: 2 },
      { url: "https://t.maze.co/502054013", weight: 2 } 
    ];

    const weightedPool: string[] = [];
    urlWeights.forEach(item => {
      for (let i = 0; i < item.weight; i++) {
        weightedPool.push(item.url);
      }
    });

    if (weightedPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * weightedPool.length);
      const selectedUrl = weightedPool[randomIndex];

      if (selectedUrl.startsWith('http')) {
        window.location.replace(selectedUrl);
      }
    }

  }, []);

  return <h3>Redirecionando...</h3>;
}

export default RandomRedirect;