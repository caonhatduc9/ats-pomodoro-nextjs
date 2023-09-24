import { useContext } from 'react';
import { StoreContext } from '@/store';

function useStore() {
    const res: any = useContext(StoreContext);
    const [state, dispatch] = res
    return [state, dispatch];
}

export default useStore;
