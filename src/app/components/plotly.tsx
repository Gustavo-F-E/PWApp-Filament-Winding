/*import dynamic from 'next/dynamic';
import { forwardRef, useId, useRef, useState, useEffect, useImperativeHandle } from 'react';

type Layout = {
  margin?: {
    t?: number;
    b?: number;
    l?: number;
    r?: number;
  };
  // Puedes agregar más propiedades según sea necesario
};

export default function Plotly = dynamic(
  () =>
    import('plotly.js/dist/plotly.js').then(({ newPlot, purge }) => {
      const Plotly = forwardRef(({ id, className, data, layout, config }: { id?: string; className?: string; data: number; layout: Layout; config: any }, ref) => {
        const originId = useId();
        const realId = id || originId;
        const originRef = useRef(null);
        const [handle, setHandle] = useState(undefined);

        useEffect(() => {
          let instance;
          originRef.current &&
            newPlot(originRef.current!, data, layout, config).then((ref) => setHandle((instance = ref)));
          return () => {
            instance && purge(instance);
          };
        }, [data]);

        useImperativeHandle(
          ref,
          () => (handle ?? originRef.current ?? document.createElement('div')),
          [handle]
        );

        return <div id={realId} ref={originRef} className={className}></div>;
      });
      Plotly.displayName = 'Plotly';
      return Plotly;
    }),
  { ssr: false }
);*/