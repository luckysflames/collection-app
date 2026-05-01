import { useState, useEffect } from "react";
import { fetchDetailsById } from "../services/apiService";

export const useFetchDetails = (id) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(id));
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const details = await fetchDetailsById(id);
                if (isMounted) setData(details);
            } catch (err) {
                if (isMounted) setError(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (!id) {
            setData(null);
            setError(null);
            setLoading(false);
            return () => {
                isMounted = false;
            };
        }

        load();

        return () => {
            isMounted = false;
        };
    }, [id]);

    return { data, loading, error };
};
