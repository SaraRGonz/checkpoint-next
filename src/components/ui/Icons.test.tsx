import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
    LogoIcon, SearchIcon, ChevronDownIcon, CheckIcon, HomeIcon,
    LibraryIcon, WishlistNavIcon, SearchNavIcon, AddGameIcon, StarIcon,
    EditIcon, TrashIcon, SaveIcon, CrossIcon, AlertIcon, GhostIcon,
    PlusIcon, HeartIcon, MenuIcon, ArrowLeftIcon, ArrowRightIcon,
    GridIcon, KanbanIcon, ShieldCheckIcon, TrophyIcon, GamepadIcon,
    TargetIcon, ClockIcon, ChecklistIcon, EyeIcon, EyeOffIcon, UserIcon
} from './Icons';

const icons = [
    LogoIcon, SearchIcon, ChevronDownIcon, CheckIcon, HomeIcon,
    LibraryIcon, WishlistNavIcon, SearchNavIcon, AddGameIcon, StarIcon,
    EditIcon, TrashIcon, SaveIcon, CrossIcon, AlertIcon, GhostIcon,
    PlusIcon, HeartIcon, MenuIcon, ArrowLeftIcon, ArrowRightIcon,
    GridIcon, KanbanIcon, ShieldCheckIcon, TrophyIcon, GamepadIcon,
    TargetIcon, ClockIcon, ChecklistIcon, EyeIcon, EyeOffIcon, UserIcon
];

describe('Icons', () => {
    it('renders all icons without crashing', () => {
        icons.forEach(Icon => {
            const { container } = render(<Icon data-testid="icon" />);
            expect(container.querySelector('svg')).toBeTruthy();
        });
    });

    it('forwards className to svg', () => {
        const { container } = render(<SearchIcon className="w-6 h-6 text-red-500" />);
        expect(container.querySelector('svg')?.getAttribute('class')).toContain('w-6');
    });

    it('forwards onClick to svg', () => {
        let clicked = false;
        const { container } = render(<TrashIcon onClick={() => { clicked = true; }} />);
        (container.querySelector('svg') as SVGElement)?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(clicked).toBe(true);
    });
});