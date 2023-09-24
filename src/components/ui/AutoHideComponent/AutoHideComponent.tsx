import useStore from '@/hooks/useStore';
import { actions } from '@/store';
import { useState, useEffect, useRef, ReactNode, FC } from 'react';

interface AutoHideComponentProps {
    children: ReactNode,
}

const AutoHideComponent: FC<AutoHideComponentProps> = ({ children }) => {
    const [state, dispatch] = useStore();
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                dispatch(actions.setShowAddTodo(false))
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef}>
            {isVisible && children}
        </div>
    );
};

export default AutoHideComponent;
