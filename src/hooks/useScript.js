import { useEffect } from 'react';

const useScript = (url, action) => {

    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.async = true;
        script.onload = action;
        script.defer = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};

export default useScript;