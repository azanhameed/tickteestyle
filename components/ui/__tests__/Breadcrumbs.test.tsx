/**
 * Example Component Test
 */

import { render, screen } from '@testing-library/react';
import Breadcrumbs from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render breadcrumb items', () => {
    const items = [
      { label: 'Shop', href: '/shop' },
      { label: 'Product' },
    ];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  it('should render home icon', () => {
    render(<Breadcrumbs items={[{ label: 'Test' }]} />);
    
    const homeLink = screen.getByLabelText('Home');
    expect(homeLink).toBeInTheDocument();
  });

  it('should apply aria-current to last item', () => {
    const items = [{ label: 'Current Page' }];
    render(<Breadcrumbs items={items} />);
    
    expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page');
  });
});
