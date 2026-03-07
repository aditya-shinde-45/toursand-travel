import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, unknown>;
  id: string;
}

function StructuredData({ data, id }: StructuredDataProps) {
  useEffect(() => {
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data, id]);

  return null;
}

export default StructuredData;
