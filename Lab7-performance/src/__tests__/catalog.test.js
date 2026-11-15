
import { describe, it, expect } from 'vitest';
import { getVisibleTutors } from '../utils/catalog';

describe('getVisibleTutors', () => {
  it('знаходить репетиторів і сортує їх за рекомендаціями', () => {
    const tutors = [
      {
        id: 1,
        name: 'Олена',
        city: 'Київ',
        subjects: ['Математика'],
        bio: '',
        pricePerHour: 500,
        format: 'online',
        verified: false,
        experienceYears: 5,
        reviews: [{ rating: 3, date: '2026-08-01' }],
      },
      {
        id: 2,
        name: 'Марія',
        city: 'Львів',
        subjects: ['Математика'],
        bio: '',
        pricePerHour: 600,
        format: 'online',
        verified: true,
        experienceYears: 10,
        reviews: [{ rating: 5, date: '2026-08-01' }],
      },
      {
        id: 3,
        name: 'Іван',
        city: 'Одеса',
        subjects: ['Фізика'],
        bio: '',
        pricePerHour: 400,
        format: 'online',
        verified: false,
        experienceYears: 3,
        reviews: [{ rating: 4, date: '2026-08-01' }],
      },
    ];

    const filters = {
      subjects: [],
      city: '',
      format: 'all',
      maxPrice: 1200,
      verifiedOnly: false,
    };

    const result = getVisibleTutors(tutors, {
      query: 'математика',
      filters,
      sortBy: 'recommended',
    });

    expect(result.map((tutor) => tutor.id)).toEqual([2, 1]);
  });
});
