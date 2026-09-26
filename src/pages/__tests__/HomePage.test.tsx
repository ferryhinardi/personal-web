import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import HomePage from '../HomePage';
import type {MainData} from '@/types/resume.types';

const data: MainData = {
  name: 'Ferry Hinardi',
  occupation: 'Senior Fullstack Engineer',
  description: 'Builds products.',
  image: 'profilepic.jpg',
  bio: 'Bio',
  contactmessage: 'Hello',
  email: 'hinardi93@gmail.com',
  phone: '+62000',
  address: {
    street: 'Tangerang',
    city: 'Tangerang',
    state: 'Banten',
    zip: '15331',
  },
  website: 'https://ferryhinardi.com',
  resumedownload: '/Ferry-Hinardi-Resume-2026.pdf',
  social: [
    {
      name: 'github',
      url: 'https://github.com/ferryhinardi',
      className: 'fa fa-github',
    },
    {
      name: 'linkedin',
      url: 'https://www.linkedin.com/in/ferryhinardi',
      className: 'fa fa-linkedin',
    },
  ],
};

describe('HomePage', () => {
  it('leads with the role, the revenue result, and selected work', () => {
    render(
      <MemoryRouter>
        <HomePage data={data} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /engineering digital products/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('10.16%')).toBeInTheDocument();
    expect(screen.getAllByText(/PayMongo/).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', {name: /view selected work/i})).toHaveAttribute(
      'href',
      '#work',
    );
    expect(screen.getByRole('link', {name: 'Dashboard'})).toHaveAttribute(
      'href',
      '/dashboard',
    );
  });
});
