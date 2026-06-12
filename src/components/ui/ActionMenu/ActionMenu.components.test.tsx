import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { ActionMenuItem } from './ActionMenuItem';
import { ActionMenuSearch } from './ActionMenuSearch';
import { ActionMenuContext, type ActionMenuContextProps } from './ActionMenuContext';
import type { ReactNode } from 'react';
import { ActionMenu } from './ActionMenu';
import { ActionMenuButton } from './ActionMenuButton';

function makeCtx(overrides?: Partial<ActionMenuContextProps>): ActionMenuContextProps {
    return {
        isOpen: true,
        setIsOpen: vi.fn(),
        onSelect: vi.fn(),
        selectedValue: '',
        position: 'bottom',
        searchQuery: '',
        setSearchQuery: vi.fn(),
        ...overrides,
    };
}

function Wrapper({ ctx, children }: { ctx: ActionMenuContextProps; children: ReactNode }) {
    return (
        <ActionMenuContext.Provider value={ctx}>
            {children}
        </ActionMenuContext.Provider>
    );
}

describe('ActionMenuItem', () => {
    it('renders children text', () => {
        const ctx = makeCtx();
        render(
            <Wrapper ctx={ctx}>
                <ActionMenuItem value="action">My Action</ActionMenuItem>
            </Wrapper>
        );
        expect(screen.getByText('My Action')).toBeInTheDocument();
    });

    it('calls onSelect and setIsOpen on click', () => {
        const ctx = makeCtx({ selectedValue: '' });
        render(
            <Wrapper ctx={ctx}>
                <ActionMenuItem value="foo">Foo</ActionMenuItem>
            </Wrapper>
        );
        fireEvent.click(screen.getByRole('menuitem'));
        expect(ctx.onSelect).toHaveBeenCalledWith('foo');
        expect(ctx.setIsOpen).toHaveBeenCalledWith(false);
    });

    it('shows check icon when value matches selectedValue', () => {
        const ctx = makeCtx({ selectedValue: 'bar' });
        render(
            <Wrapper ctx={ctx}>
                <ActionMenuItem value="bar">Bar</ActionMenuItem>
            </Wrapper>
        );
        const btn = screen.getByRole('menuitem');
        expect(btn.querySelector('svg')).toBeInTheDocument();
    });

    it('shows check icon when selected prop is true', () => {
        const ctx = makeCtx({ selectedValue: 'other' });
        render(
            <Wrapper ctx={ctx}>
                <ActionMenuItem value="baz" selected={true}>Baz</ActionMenuItem>
            </Wrapper>
        );
        const btn = screen.getByRole('menuitem');
        expect(btn.querySelector('svg')).toBeInTheDocument();
    });

    it('does not show check icon when not selected', () => {
        const ctx = makeCtx({ selectedValue: 'other' });
        render(
            <Wrapper ctx={ctx}>
                <ActionMenuItem value="nope">Nope</ActionMenuItem>
            </Wrapper>
        );
        const btn = screen.getByRole('menuitem');
        expect(btn.querySelector('svg')).not.toBeInTheDocument();
    });

    it('returns null when searchQuery does not match children', () => {
        const ctx = makeCtx({ searchQuery: 'xyz' });
        const { container } = render(
            <Wrapper ctx={ctx}>
                <ActionMenuItem value="foo">Foo Item</ActionMenuItem>
            </Wrapper>
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders when searchQuery matches children (case-insensitive)', () => {
        const ctx = makeCtx({ searchQuery: 'FOO' });
        render(
            <Wrapper ctx={ctx}>
                <ActionMenuItem value="foo">Foo Item</ActionMenuItem>
            </Wrapper>
        );
        expect(screen.getByText('Foo Item')).toBeInTheDocument();
    });

    it('throws error when used outside ActionMenu context', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() =>
            render(<ActionMenuItem value="x">X</ActionMenuItem>)
        ).toThrow('ActionMenu sub-components must be used within the <ActionMenu> wrapper');
        consoleError.mockRestore();
    });
});

describe('ActionMenuSearch', () => {
    it('renders search input with current query value', () => {
        const ctx = makeCtx({ searchQuery: 'hello' });
        render(
            <Wrapper ctx={ctx}>
                <ActionMenuSearch />
            </Wrapper>
        );
        const input = screen.getByPlaceholderText('Search filter...');
        expect(input).toHaveValue('hello');
    });

    it('calls setSearchQuery on input change', () => {
        const ctx = makeCtx({ searchQuery: '' });
        render(
            <Wrapper ctx={ctx}>
                <ActionMenuSearch />
            </Wrapper>
        );
        const input = screen.getByPlaceholderText('Search filter...');
        fireEvent.change(input, { target: { value: 'shooter' } });
        expect(ctx.setSearchQuery).toHaveBeenCalledWith('shooter');
    });

    it('stops propagation on click', () => {
        const ctx = makeCtx({ searchQuery: '' });
        const parentClick = vi.fn();
        render(
            <div onClick={parentClick}>
                <Wrapper ctx={ctx}>
                    <ActionMenuSearch />
                </Wrapper>
            </div>
        );
        const input = screen.getByPlaceholderText('Search filter...');
        fireEvent.click(input);
        expect(parentClick).not.toHaveBeenCalled();
    });

    it('throws error when used outside ActionMenu context', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() =>
            render(<ActionMenuSearch />)
        ).toThrow('ActionMenu sub-components must be used within the <ActionMenu> wrapper');
        consoleError.mockRestore();
    });
});

describe('ActionMenu wrapper', () => {
    it('renders children inside wrapper', () => {
        render(
            <ActionMenu value="test" onSelect={vi.fn()}>
                <ActionMenu.Button>Select</ActionMenu.Button>
                <ActionMenu.Overlay>
                    <ActionMenu.Item value="a">Option A</ActionMenu.Item>
                </ActionMenu.Overlay>
            </ActionMenu>
        );
        expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('opens overlay on button click', () => {
        render(
            <ActionMenu value="" onSelect={vi.fn()}>
                <ActionMenu.Button>Open me</ActionMenu.Button>
                <ActionMenu.Overlay>
                    <ActionMenu.Item value="x">X</ActionMenu.Item>
                </ActionMenu.Overlay>
            </ActionMenu>
        );
        fireEvent.click(screen.getByText('Open me'));
        expect(screen.getByText('X')).toBeInTheDocument();
    });

    it('closes and clears searchQuery on outside click', async () => {
        render(
            <div>
                <div data-testid="outside">outside</div>
                <ActionMenu value="" onSelect={vi.fn()}>
                    <ActionMenu.Button>Menu</ActionMenu.Button>
                    <ActionMenu.Overlay>
                        <ActionMenu.Search />
                        <ActionMenu.Item value="y">Y</ActionMenu.Item>
                    </ActionMenu.Overlay>
                </ActionMenu>
            </div>
        );
        fireEvent.click(screen.getByText('Menu'));
        expect(screen.getByText('Y')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Search filter...'), { target: { value: 'y' } });
        fireEvent.mouseDown(screen.getByTestId('outside'));
        await waitFor(() => {
            expect(screen.queryByText('Y')).not.toBeInTheDocument();
        });
    });

    it('calls onSelect when item clicked', () => {
        const onSelect = vi.fn();
        render(
            <ActionMenu value="" onSelect={onSelect}>
                <ActionMenu.Button>Menu</ActionMenu.Button>
                <ActionMenu.Overlay>
                    <ActionMenu.Item value="picked">Pick me</ActionMenu.Item>
                </ActionMenu.Overlay>
            </ActionMenu>
        );
        fireEvent.click(screen.getByText('Menu'));
        fireEvent.click(screen.getByRole('menuitem'));
        expect(onSelect).toHaveBeenCalledWith('picked');
    });

    it('ActionMenuButton uses custom className when provided', () => {
        render(
            <ActionMenuContext.Provider value={{
                isOpen: false, setIsOpen: vi.fn(), onSelect: vi.fn(),
                selectedValue: '', position: 'bottom', searchQuery: '', setSearchQuery: vi.fn()
            }}>
                <ActionMenuButton className="custom-class">Custom</ActionMenuButton>
            </ActionMenuContext.Provider>
        );
        expect(screen.getByRole('button').className).toContain('custom-class');
    });
});